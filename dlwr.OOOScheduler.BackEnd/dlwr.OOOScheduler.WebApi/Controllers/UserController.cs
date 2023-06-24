using dlwr.OOOScheduler.Repositories.Models;
using dlwr.OOOScheduler.Services;
using dlwr.OOOScheduler.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace dlwr.OOOScheduler.WebApi.Controllers
{
    [Authorize]
    [Route("user")] 
    public class UserController : Controller
    {
        private IDBService _DbService { get; set; }
        public UserController(IDBService DbService) {
            _DbService = DbService;
        }

        [HttpGet("check")]
        public async Task<ActionResult<OutputUser>> CheckUserId()
        {
            //TODO combine the events 
            
            var user = await _DbService.CheckUser(GetUserId());
            Console.WriteLine(user.outputUser.PlaceHolders.First().Name);
            if (user.isNew)
            {
                Console.WriteLine("created");
                return Created("user/check/" + user.outputUser.Id, user.outputUser);
            }
            else
            {
                Console.WriteLine("old");
                 return Ok(user.outputUser);
            }
        }

        [HttpPatch("settings")]
        public async Task<ActionResult> UpdateUserSettings([FromBody] Setting setting)
        {
            var id = GetUserId();
            setting.UserId = id;
            Console.WriteLine("juice settings");
            var newSet = await _DbService.UpdateSettings(setting);
            if (newSet == null) return BadRequest("you're trying to set an object that is yours ");

            return Ok(newSet);
        }

        [HttpPost("placeholder")]
        public async Task<ActionResult> CreatePlaceholder([FromBody] CustomPlaceHolder item)
        {
            item.DbUserId = GetUserId();
            _DbService.CreatePlaceholder(item);
            return Ok(item);
        }

        [HttpDelete("placeholder/{placeholderId}")]
        public ActionResult DeletePlaceholder(string placeholderId)
        {
            //TODO update delete placeholder to take a userid
            _DbService.DeletePlaceholder(placeholderId, GetUserId());
            return Ok();
        }

        [HttpPatch("placeholder")]
        public ActionResult<CustomPlaceHolder> UpdatePlaceholder([FromBody] CustomPlaceHolder item)
        {
            item.DbUserId = GetUserId();
            var res = _DbService.UpdatePlaceholder(item);
            return Ok(res);
        }

        [HttpPost("message")]
        public ActionResult CreateMessage([FromBody] DBMessage item)
        {
            var princ = GetUserId();
            item.UserId = princ;
            _DbService.CreateMessage(item);
            return Ok(item);
        }

        [HttpDelete("message/{messageId}")]
        public ActionResult DeleteMessage(string messageId)
        {
            //TODO validation
            var userId = GetUserId();
            _DbService.DeleteMessage(messageId, GetUserId());
            return Ok();
        }

        [HttpPatch("message")]
        public ActionResult<DBMessage> UpdateMessage([FromBody] DBMessage item)
        {
            var uId=GetUserId();
            item.UserId = uId;
            var res = _DbService.UpdateMessage(item);
            return Ok(res);
        }

        private string GetUserId()
        {
            return (HttpContext.User.Identity as ClaimsIdentity).FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;

        }
    }
}
