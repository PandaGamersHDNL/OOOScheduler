using Azure.Storage.Queues;
using dlwr.OOOScheduler.Core;
using dlwr.OOOScheduler.Services;
using dlwr.OOOScheduler.Services.Contracts;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Graph.Extensions;
using Newtonsoft.Json;
using EventMessage = dlwr.OOOScheduler.Services.EventMessage;

namespace dlwr.OOOScheduler.WebJobs
{
    public class Functions
    {
        readonly private AppDataService DataService;
        readonly private IDBService DbService;
        readonly private IConfiguration Config;
        public Functions(AppDataService dataService, IDBService dBService, IConfiguration configuration)
        {
            DataService = dataService;
            DbService = dBService;
            Config = configuration;
        }

        //Process message id in api (for if use makes request but then changes message definition. prob not needed because queue is static. maybe put message stuff in queue request
        public async Task ProcessQueueMessage([QueueTrigger(Global.QueNames.AutoReplyQue)] AutoReplyQueInput input, ILogger logger)
        {
            var autoReplySet = input.MailboxSettings.AutomaticRepliesSetting;
            Console.WriteLine("proccess q message", input.UserId);
            var user = (await DbService.CheckUser(input.UserId)).outputUser;
            if (user.Setting.IsEnabled == false)
            {
                Console.WriteLine($"proccess q user: {user.Id} has disabled this service");
                return;
            }
            if (autoReplySet.InternalReplyMessage.Contains('{'))
            {
                //should only get never make (expected)
                Console.WriteLine("proccess q ttime ", autoReplySet.ScheduledStartDateTime.DateTime.ToString(), "*", input.MailboxSettings.TimeZone);
                input.MailboxSettings.AutomaticRepliesSetting.InternalReplyMessage = ReplacePlaceholders(autoReplySet, user, input.MailboxSettings.TimeZone);
            }

            var x = await DataService.UpdateMailboxSettings(input.UserId, input.MailboxSettings);
        }

        public async Task FindAgendaItems([TimerTrigger("0 * * * * *", RunOnStartup = true)] TimerInfo myTimer,
            ILogger log)
        {
            //TODO make sure event has passed not just start before current -> ignore
            log.LogInformation("Find agenda items");
            var users = await DbService.GetAllUsers();
            var queConStr = Config.GetValue<string>("AzureWebJobsStorage");
            var queClient = new QueueClient(queConStr, Global.QueNames.AutoReplyQue, new QueueClientOptions { MessageEncoding = QueueMessageEncoding.Base64 });
            foreach (var user in users)
            {
                var nextUp = await DataService.GetNextEvent(user.Id);
                if (nextUp == null) { return; }
                var delta = nextUp.End.ToDateTime() - nextUp.Start.ToDateTime();
                if ((delta.TotalHours + 0.02) < user.Setting.Threshold)
                {
                    Console.WriteLine("eep threshold is greater");
                    continue;
                }
                //TODO batch request the mailbox settings and the next event
                Console.WriteLine("processing ", user.Id);
                var currentMailboxSet = await DataService.GetMailboxSettings(user.Id);
                // check if next is equal to ARS reply
                var messageObj = GetEventMessage(nextUp, user);
                var newMailboxSet = new MailboxSettings
                {
                    AutomaticRepliesSetting = new AutomaticRepliesSetting
                    {
                        Status = AutomaticRepliesStatus.Scheduled,
                        ScheduledStartDateTime = nextUp.Start,
                        ScheduledEndDateTime = nextUp.End,
                        InternalReplyMessage = messageObj.Message
                    },
                    TimeZone = currentMailboxSet.TimeZone

                };
                if (messageObj.MessageType == "Defined")
                {
                    try
                    {
                        var userMsg = await DbService.GetMessage(messageObj.MessageId);
                        if(userMsg != null)
                        {
                            newMailboxSet.AutomaticRepliesSetting.InternalReplyMessage = userMsg.MessageStr;
                        } else
                        {
                            newMailboxSet.AutomaticRepliesSetting.InternalReplyMessage = messageObj.Message;
                        }
                    }
                    catch (Exception ee){ }
                }

                if (currentMailboxSet != null && currentMailboxSet.AutomaticRepliesSetting.Status != AutomaticRepliesStatus.Disabled)

                {
                    var autoRepSet = currentMailboxSet.AutomaticRepliesSetting;
                    var startEq = autoRepSet.ScheduledStartDateTime.DateTime == nextUp.Start.DateTime;
                    var endEq = autoRepSet.ScheduledEndDateTime.DateTime == nextUp.End.DateTime;
                    var msgEq = autoRepSet.InternalReplyMessage ==
                        ReplacePlaceholders(newMailboxSet.AutomaticRepliesSetting, user, currentMailboxSet.TimeZone);
                    if (startEq && endEq && msgEq)
                    {
                        Console.WriteLine($"current auto reply equals to next up ");
                        continue;
                    }
                }

                var payload = JsonConvert.SerializeObject(
                    new AutoReplyQueInput { MailboxSettings = newMailboxSet, UserId = user.Id }
                    );

                queClient.SendMessage(payload);
                Console.WriteLine("added to queue " + messageObj.Message);
            }
        }
        public string GetPlaceholderStr(string name)
        {
            return $"{{{name}}}";
        }
        public DateTime? ConvertUTCTo(DateTime utc, string timezone)
        {
            try
            {
                Console.WriteLine("convert utc to {0}", timezone);
                TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById(timezone);
                DateTime converted = TimeZoneInfo.ConvertTimeFromUtc(utc, cstZone);
                Console.WriteLine("The date and time are {0} {1}.",
                             converted,
                             cstZone.IsDaylightSavingTime(converted) ?
                                     cstZone.DaylightName : cstZone.StandardName);
                return converted;
            }
            catch (TimeZoneNotFoundException)
            {
                Console.WriteLine("The registry does not define the Central Standard Time zone.");
            }
            catch (InvalidTimeZoneException)
            {
                Console.WriteLine("Registry data on the Central Standard Time zone has been corrupted.");
            }
            return null;
        }

        private string ReplacePlaceholders(AutomaticRepliesSetting autoReplySet, OutputUser user, string timezone)
        {
            string format = "ddd, dd MMMM yyyy, HH:mm";
            foreach (var item in user.PlaceHolders)
            {
                string outStr = "";

                switch (item.Id)
                {
                    case (int)GlobalMessages.startDate:
                        outStr = ConvertUTCTo(autoReplySet.ScheduledStartDateTime.ToDateTime(), timezone)?.ToString(format);
                        break;
                    case (int)GlobalMessages.endDate:
                        outStr = ConvertUTCTo(autoReplySet.ScheduledEndDateTime.ToDateTime(), timezone)?.ToString(format);
                        break;
                    default:
                        outStr = "Can't find global placeholder definition";
                        break;
                }
                autoReplySet.InternalReplyMessage = autoReplySet.InternalReplyMessage.Replace(GetPlaceholderStr(item.Name), outStr);
            }
            foreach (var item in user.CustomPlaceholders)
            {
                autoReplySet.InternalReplyMessage = autoReplySet.InternalReplyMessage.Replace(GetPlaceholderStr(item.Name), item.DefaultValue);
            }
            return autoReplySet.InternalReplyMessage;
        }
        private static EventMessage GetEventMessage(Event item, OutputUser user)
        {
            EventMessage messageObj;
            try
            {
                var obj = item.AdditionalData[Global.SchemaExtentions.MessageId];
                messageObj = JsonConvert.DeserializeObject<EventMessage>(obj.ToString());
            }
            catch (Exception ex)
            {
                try
                {
                    var dbdefaultMsg = user.Messages.First((v) => v.Id == user.Setting.DefaultMessageId);
                    messageObj = new EventMessage
                    {
                        Message = dbdefaultMsg.MessageStr,
                        MessageId = dbdefaultMsg.Id.ToString(),
                        MessageType = "Defined"
                    };
                }
                catch (Exception ex2)
                {
                    messageObj = new EventMessage { Message = "no default message set, user is away from {startDate} untill {endDate} }" };
                    Console.WriteLine("can't find default message");
                }
            }
            return messageObj;
        }
    }

}


enum GlobalMessages
{
    startDate = 1,
    endDate = 2

}