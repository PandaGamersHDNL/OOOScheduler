using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Repositories.Models
{
    public class Setting
    {
        
        public int Id { get; set; } 
        [ForeignKey("User")]
        public string UserId { get; set; }
        [JsonIgnore]
        public virtual DbUser User { get; set; }
        public bool IsEnabled { get; set; }
        public float Threshold { get; set; }
        [ForeignKey("Message")]
        public int DefaultMessageId { get; set; }
        
    }
}
