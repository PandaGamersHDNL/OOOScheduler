using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Identity.Web;

namespace dlwr.OOOScheduler.WebApi.Controllers
{
    [Authorize]
    public class AuthController : Controller
    {
        private readonly ITokenAcquisition _tokenAcquisition;
        private IMemoryCache _cache;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ITokenAcquisition tokenAcquisition, IMemoryCache memoryCache, ILogger<AuthController> logger)
        {
            _tokenAcquisition = tokenAcquisition;
            _cache = memoryCache;
            _logger = logger;
        }

        [HttpGet]
        [Route("acquireobotoken")]
        public async Task<ActionResult<string>> AcquireOBOToken(string resource)
        {
            var token = await _tokenAcquisition.GetAccessTokenForUserAsync(new List<string>{ "User.Read" });
            
            return token;
        }
    }
}
