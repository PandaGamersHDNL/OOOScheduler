using Microsoft.AspNetCore.Mvc;

namespace dlwr.OOOScheduler.WebApi.Controllers
{
    [Route("/")]
    public class HealthController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            Console.WriteLine("Health check");
            return Ok("api is running");
        }
    }
}
