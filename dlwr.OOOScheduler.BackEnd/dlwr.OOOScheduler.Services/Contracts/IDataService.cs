using Microsoft.Graph;

namespace dlwr.OOOScheduler.Services.Contracts
{
    public interface IDataService
    {
        public Task<IEnumerable<Event>> GetEvents(string startDate, string endDate);
        public Task<IEnumerable<Event>> GetEventsInstances(string id, string startDate, string endDate);
        public Task<Event?> GetEventId(string id);
        public Task<Event?> UpdateEvent(Event eventData);
        public Task<Event?> CreateEvent(Event item);
        public Task DeleteEvent(string id);
        public Task ScheduleAutoReply(Event item);
        public Task DeleteAutoreply(Event item);
        public Task<Event?> UpdateAutoreply(Event item);
    }
}
