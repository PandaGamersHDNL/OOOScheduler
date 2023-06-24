using dlwr.OOOScheduler.Core;
using Microsoft.Graph;
using Microsoft.Graph.Extensions;

namespace dlwr.OOOScheduler.Services
{
    public class AppDataService
    {
        static string EventSelect = Global.SchemaExtentions.MessageId + ",start,end,subject,showAs,type";

        private readonly GraphServiceClient _MSClient;
        public AppDataService(GraphServiceClient MSClient)
        {
            _MSClient = MSClient;

        }

        public async Task<MailboxSettings> UpdateMailboxSettings(string UserId, MailboxSettings mailboxSettings)
        {
            // Get the request URL to the user from the SDK
            // and add the /mailboxsettings segment
            var requestUrl = $"{_MSClient.Users[UserId].Request().RequestUrl}/mailboxsettings";

            // Use the SDK's serializer to generate the JSON payload
            var jsonPayload = 
                _MSClient.HttpProvider.Serializer.SerializeAsJsonContent(mailboxSettings);

            // Create a new Http request message with the JSON payload
            var requestMessage = new HttpRequestMessage(HttpMethod.Patch, requestUrl);
            requestMessage.Content = jsonPayload;

            // Authenticate the message
            await _MSClient.AuthenticationProvider.AuthenticateRequestAsync(requestMessage);
            // Send the request
            Console.WriteLine("after auth");
            var response = await _MSClient.HttpProvider.SendAsync(requestMessage);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Updated mailbox settings");
                // If needed, deserialize the response body
                var responseBody = await response.Content.ReadAsStringAsync();
                return _MSClient.HttpProvider.Serializer
                    .DeserializeObject<MailboxSettings>(responseBody);
            }
            else
            {
                throw new ServiceException(
                    new Error
                    {
                        Code = response.StatusCode.ToString(),
                        Message = await response.Content.ReadAsStringAsync()
                    }
                );
            }
        }
        public async Task<MailboxSettings> GetMailboxSettings(string userId)
        {
            // Get the request URL to the user from the SDK
            // and add the /mailboxsettings segment
            var requestUrl = $"{_MSClient.Users[userId].Request().RequestUrl}/mailboxsettings";

            // Use the SDK's serializer to generate the JSON payload

            // Create a new Http request message with the JSON payload
            var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl);

            // Authenticate the message
            await _MSClient.AuthenticationProvider.AuthenticateRequestAsync(requestMessage);
            // Send the request
            var response = await _MSClient.HttpProvider.SendAsync(requestMessage);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("get mailbox settings");
                // If needed, deserialize the response body
                var responseBody = await response.Content.ReadAsStringAsync();
                return _MSClient.HttpProvider.Serializer
                    .DeserializeObject<MailboxSettings>(responseBody);
            }
            else
            {
                throw new ServiceException(
                    new Error
                    {
                        Code = response.StatusCode.ToString(),
                        Message = await response.Content.ReadAsStringAsync()
                    }
                );
            }
        }

        public async Task<Event> GetNextEvent(string id)
        {
            var queryOptions = new List<QueryOption>
            { 
              new QueryOption("StartDateTime", DateTime.UtcNow.ToDateTimeTimeZone().DateTime),
              new QueryOption("EndDateTime", (DateTime.UtcNow.AddDays(7)).ToDateTimeTimeZone().DateTime)
            };
            try
            {
            var req = _MSClient.Users[id].CalendarView.Request(queryOptions).Filter("showAs eq 'oof'").Select(EventSelect).OrderBy("start/datetime,end/datetime").Top(1);
                var res = (await req.GetAsync()).First();
                return res;

            } catch (Exception e)
            {
                return null;
            }
        }
    }
}

