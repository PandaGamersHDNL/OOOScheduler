using dlwr.OOOScheduler.Services.Contracts;
using Microsoft.Graph;
using Microsoft.Graph.Extensions;
using System.Collections.Generic;
using System.Reflection;


namespace dlwr.OOOScheduler.Services
{
    public class MockDataService : IDataService
    {
        static int LatestId = 0;
        public List<Event> events = new List<Event>();

        public MockDataService() {
            events.Add(new Event
            {
                Id = "879465",
                Subject = "in day",
                Start = DateTime.Now.AddDays(5).ToDateTimeTimeZone(TimeZoneInfo.Local),
                End = DateTime.Now.AddDays(5).AddHours(2).ToDateTimeTimeZone(TimeZoneInfo.Local),
                Type = EventType.SingleInstance
            });
            events.Add(new Event
            {
                Id = "879457",
                Subject = "in day2",
                Body = new ItemBody { Content = "I am out of office for this time. Ask my team lead if your question is very important" },
                Start = DateTime.Now.AddDays(5).ToDateTimeTimeZone(TimeZoneInfo.Local),
                End = DateTime.Now.AddDays(20).AddHours(3).ToDateTimeTimeZone(TimeZoneInfo.Local),
                Type = EventType.SingleInstance
            });
        }

        public Task<Event?> CreateEvent(Event item)
        {
            item.Id = GetUniqueId();
            events.Add(item);
            return Task.FromResult(item);
        }

        public Task DeleteAutoreply(Event item)
        {
            throw new NotImplementedException();
        }

        public Task DeleteEvent(string id)
        {
            var remove = events.Find((v) => v.Id == id);
            if(remove != null)
            {
                _ = events.Remove(remove);
            }
            return Task.CompletedTask;
        }

        public Task DeleteEvent(Event item)
        {
            throw new NotImplementedException();
        }

        public Task<Event?> GetEventId(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> GetEvents()
        {
            return Task.FromResult(events.AsEnumerable());
        }

        public Task<IEnumerable<Event>> GetEvents(string startDate, string endDate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> GetEventsInstances(string id, string startDate, string endDate)
        {
            throw new NotImplementedException();
        }

        public Task ScheduleAutoReply(Event item)
        {
            throw new NotImplementedException();
        }

        public Task ScheduleAutoReply(Event item, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<Event?> UpdateAutoreply(Event item)
        {
            throw new NotImplementedException();
        }

        public Task<Event?> UpdateEvent(Event eventData)
        {
            var toUpdate = events.First((v) => v.Id == eventData.Id);
            PropertyInfo[] properties = typeof(Event).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                property.SetValue(toUpdate, property.GetValue(eventData));
            }
            Console.WriteLine(toUpdate.Subject);
            return Task.FromResult( toUpdate);
        }

        private string GetUniqueId()
        {
            LatestId++;
            var id = LatestId.ToString();
            var matchingId = events.Find((v)=> v.Id == id);
            if(matchingId != null)
            {
                id = GetUniqueId();
            }
            return id;
        }
    }
}
