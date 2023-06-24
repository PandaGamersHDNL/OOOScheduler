using dlwr.OOOScheduler.Services;
using dlwr.OOOScheduler.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;


namespace dlwr.OOOScheduler.WebApi.Controllers
{
    [Authorize]
    [Route("graph")]
    public class GraphController : Controller
    {

        readonly IDataService _DataService;
        readonly QueueService _QueueService;
        public GraphController(IDataService DataService, QueueService queueService)
        {
            _DataService = DataService;
            _QueueService = queueService;
            //const eventsLoc = MSClient.Me.CalendarView.Request().GetAsync();
            //var x = MSClient.Me.CalendarView;
            //Console.WriteLine(x.ToString());
            // GET https://graph.microsoft.com/v1.0/me

        }
        // GET:
        [HttpGet("events/{startDate}/{endDate}")]
        public async Task<ActionResult>  Get(string startDate, string endDate)
        {
            
            try
            {
                var ret = await _DataService.GetEvents(startDate, endDate);
                return Ok(ret);
            } catch (ServiceException ex)
            {
                Console.WriteLine(ex.GetType());
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("events")]
        public async Task<ActionResult> UpdateEvent([FromBody] Event item)
        {
            Console.WriteLine(item.Subject);
            return Ok(await _DataService.UpdateEvent(item));
        }
        [HttpPost("events")]
        public async Task<ActionResult> CreateEvent([FromBody] Event item)
        {
            Console.WriteLine(item.Start.TimeZone.ToString());
            var res = await _DataService.CreateEvent(item);
            Console.WriteLine(res.Start.TimeZone);
            return Ok(res);
        }

        [HttpDelete("events/{id}")]
        public async Task<ActionResult> DeleteEvent(string id)
        {
            await _DataService.DeleteEvent(id);
            return Ok();
        }
        [HttpGet("events/{id}")]
        public async Task<ActionResult> GetEvent(string id)
        {
            var res = await _DataService.GetEventId(id);
            return Ok(res);
        }

        [HttpGet("events/{id}/instances/{start}/{end}")]
        public async Task<ActionResult> getEventInstances (string id, string start, string end)
        {
            var res = await _DataService.GetEventsInstances(id, start, end);
            return Ok(res);
        }

    }
}






