using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace dlwr.OOOScheduler.Repositories.Models
{
    public class DBMessage
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string MessageStr { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        [JsonIgnore]
        public DbUser User { get; set; }
    }
}
