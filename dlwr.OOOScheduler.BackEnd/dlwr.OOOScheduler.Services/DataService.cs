using dlwr.OOOScheduler.Core;
using dlwr.OOOScheduler.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Graph;
using Microsoft.Graph.Extensions;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace dlwr.OOOScheduler.Services
{
    public class DataService : IDataService
    {
        static string EventSelect = Global.SchemaExtentions.MessageId + ",start,end,subject,showAs,type,seriesMasterId, recurrence";
        GraphServiceClient _MSClient;
        IQueueService _QueueService;
        public DataService(GraphServiceClient MSClient, IQueueService queueService)
        {
            _MSClient = MSClient;
            _QueueService = queueService;
        }
        public async Task<Event?> CreateEvent(Event item)
        {
            var messagePropDict = new Dictionary<string, object>();
            foreach (var x in item.AdditionalData)
            {
                messagePropDict.Add(x.Key, x.Value);
            }

            item.AdditionalData.Clear();
            //Console.WriteLine($"Additional Data {ext.AdditionalData.Count},{ext.AdditionalData.First().Key} eep");
            var res = await _MSClient.Me.Events.Request().AddAsync(item);
            var req = _MSClient.Me.Events[res.Id].Request();
            Console.WriteLine($"url {req.RequestUrl}");
            //update extention data
            _ = await req.UpdateAsync(new Event { AdditionalData = messagePropDict });
            res.AdditionalData = messagePropDict;
            await ScheduleAutoReply(res);
            return res;
        }

        public async Task DeleteEvent(string id)
        {
            var item = await _MSClient.Me.Events[id].Request().GetAsync();
            //TODO remove scheduled event if this event matches
            await DeleteAutoreply(item);
            await _MSClient.Me.Events[item.Id].Request().DeleteAsync();
        }

        public async Task<IEnumerable<Event>> GetEvents(string startDate, string endDate)
        {
            var events = new UserEventsCollectionPage();
            var reqParams = new List<QueryOption>
            {
                new QueryOption("startdatetime",startDate),
                new QueryOption("enddatetime", endDate)
            };
            var eventReq = await _MSClient.Me.CalendarView.Request(reqParams)
                .Select(EventSelect)
                .Filter("showAs eq 'oof'").Top(20).GetAsync();
            //Console.WriteLine(eventReq.)
            
            var pageIterator = PageIterator<Event>
                .CreatePageIterator(
                    _MSClient,
                    eventReq,
                    // Callback executed for each item in
                    // the collection
                    (m) =>
                    {
                        events.Add(m);
                        Console.WriteLine(m.Subject);
                        return true;
                    },
                    // Used to configure subsequent page
                    // requests
                    (req) =>
                    {
                        // Re-add the header to subsequent requests
                        
                        return req;
                    }
                );

            await pageIterator.IterateAsync();

            return events;
        }
        public async Task<Event?> GetEventId(string id)
        {
            var ret = await _MSClient.Me.Events[id].Request().Select(EventSelect).GetAsync();
            return ret;
        }
        public async Task<Event?> UpdateEvent(Event item)
        {
            await UpdateAutoreply(item);
            var messagePropDict = new Dictionary<string, object>();
            foreach (var x in item.AdditionalData)
            {
                messagePropDict.Add(x.Key, x.Value);
            }
            item.AdditionalData.Clear();
            var res = await _MSClient.Me.Events[item.Id].Request().UpdateAsync(item);
            await _MSClient.Me.Events[item.Id].Request().UpdateAsync(new Event { AdditionalData = messagePropDict });
            res.AdditionalData = messagePropDict;
            return res;
        }

        public async Task ScheduleAutoReply(Event item)
        {
            try
            {
                var messageObj = GetEventMessage(item);
                var currUser = await _MSClient.Me.Request().Select("MailboxSettings").GetAsync();

                var mailboxSettings = new MailboxSettings
                {
                    AutomaticRepliesSetting = new AutomaticRepliesSetting
                    {
                        ScheduledStartDateTime = item.Start,
                        ScheduledEndDateTime = item.End,
                        InternalReplyMessage = messageObj.Message,
                        Status = AutomaticRepliesStatus.Scheduled
                    },
                    TimeZone = currUser.MailboxSettings.TimeZone
                };

                if (currUser.MailboxSettings.AutomaticRepliesSetting.Status == AutomaticRepliesStatus.Scheduled &&
                    currUser.MailboxSettings.AutomaticRepliesSetting.ScheduledStartDateTime.ToDateTime() <
                    mailboxSettings.AutomaticRepliesSetting.ScheduledStartDateTime.ToDateTime())

                {
                    Console.WriteLine("Automatic reply not set, because other event is earlier");
                    return;
                }
                Console.WriteLine(mailboxSettings.AutomaticRepliesSetting.ScheduledEndDateTime.ToDateTime().ToString());
                if (mailboxSettings.AutomaticRepliesSetting.ScheduledEndDateTime.ToDateTime() < DateTime.UtcNow)
                {
                    Console.WriteLine("Automatic reply not set, because event has already passed");
                    return;
                }

                _QueueService.AddToAutoReply(new AutoReplyQueInput
                {
                    UserId = currUser.Id,
                    MailboxSettings = mailboxSettings
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        public void UpdateMailboxSettings(MailboxSettings mailboxSettings, string userId)
        {
            _QueueService.AddToAutoReply(new AutoReplyQueInput { MailboxSettings = mailboxSettings, UserId = userId });
            return;
        }
        public async Task DeleteAutoreply(Event item)
        {
            var currMailboxSettings = await _MSClient.Me.Request().Select("MailboxSettings").GetAsync();
            var autoReplySet = currMailboxSettings.MailboxSettings.AutomaticRepliesSetting;
            if (autoReplySet.ScheduledStartDateTime.DateTime == item.Start.DateTime &&
                autoReplySet.ScheduledEndDateTime.DateTime == item.End.DateTime)
            {
                Console.WriteLine("erp deleting event");
                UpdateMailboxSettings(new MailboxSettings { AutomaticRepliesSetting = new AutomaticRepliesSetting { Status = AutomaticRepliesStatus.Disabled } },
                    currMailboxSettings.Id);
            }
        }

        public async Task<Event?> UpdateAutoreply(Event newEvent)
        {
            var oldEvent = await _MSClient.Me.Events[newEvent.Id].Request().GetAsync();
            var user = (await _MSClient.Me.Request().Select("MailboxSettings").GetAsync());
            var currMailboxSettings = user.MailboxSettings;
            var autoreplySet = currMailboxSettings.AutomaticRepliesSetting;
            //check message?
            if (autoreplySet.ScheduledStartDateTime.DateTime == oldEvent.Start.DateTime &&
                autoreplySet.ScheduledEndDateTime.DateTime == oldEvent.End.DateTime)

            {
                autoreplySet.ScheduledStartDateTime = newEvent.Start;
                autoreplySet.ScheduledEndDateTime = newEvent.End;
                autoreplySet.InternalReplyMessage = GetEventMessage(newEvent).Message;
                var newSettings = new MailboxSettings { AutomaticRepliesSetting = autoreplySet };
                UpdateMailboxSettings(newSettings, user.Id);
                Console.WriteLine($"eep updated mailbox {currMailboxSettings.AutomaticRepliesSetting.ScheduledStartDateTime.DateTime}");
            }
            Console.WriteLine($"eep updated {autoreplySet.ScheduledStartDateTime.DateTime == oldEvent.Start.DateTime} {autoreplySet.ScheduledEndDateTime.DateTime == oldEvent.End.DateTime}");
            return newEvent;
        }
        public static EventMessage? GetEventMessage(Event item)
        {
            try
            {
                var obj = item.AdditionalData[Global.SchemaExtentions.MessageId];

                return JsonConvert.DeserializeObject<EventMessage>(obj.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }
        /*
         * gets all the instances of the serie master
         */
        public async Task<IEnumerable<Event>> GetEventsInstances(string id, string startDate, string endDate)
        {
            var events = new UserEventsCollectionPage();
            var reqParams = new List<QueryOption>
            {
                new QueryOption("startdatetime",startDate),
                new QueryOption("enddatetime", endDate)
            };
            var eventReq = await _MSClient.Me.Events[id].Instances.Request(reqParams)
                .Select(EventSelect)
                .Filter("showAs eq 'oof'").Top(20).GetAsync();
            //Console.WriteLine(eventReq.)

            var pageIterator = PageIterator<Event>
                .CreatePageIterator(
                    _MSClient,
                    eventReq,
                    // Callback executed for each item in
                    // the collection
                    (m) =>
                    {
                        events.Add(m);
                        Console.WriteLine(m.Subject);
                        return true;
                    },
                    // Used to configure subsequent page
                    // requests
                    (req) =>
                    {
                        // Re-add the header to subsequent requests

                        return req;
                    }
                );

            await pageIterator.IterateAsync();

            return events;
        }
    }
    



    public class EventMessage 
    {
        [JsonInclude]
        [JsonPropertyName("messageType")]
        public string? MessageType { get; set; }

        [JsonInclude]
        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonInclude]
        [JsonPropertyName("messageId")]
        public string? MessageId { get; set; }
    }

}