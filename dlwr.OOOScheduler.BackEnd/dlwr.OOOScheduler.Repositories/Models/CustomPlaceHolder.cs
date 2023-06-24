using lwr.OOOScheduler.Repositories.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace dlwr.OOOScheduler.Repositories.Models
{
    public class CustomPlaceHolder : PlaceHolder
    {
        [ForeignKey("DbUser")]
        public string DbUserId { get; set; }
    }
}
