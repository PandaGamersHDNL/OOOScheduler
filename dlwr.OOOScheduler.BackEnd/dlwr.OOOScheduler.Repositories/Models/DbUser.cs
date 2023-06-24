using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Repositories.Models
{
    public class DbUser
    {
        [Key]
        public string Id { get; set; }
        
        public virtual Setting? Setting { get; set; }
        public ICollection<DBMessage> Messages { get; set; }
        public ICollection<CustomPlaceHolder> CustomPlaceholders { get; set; }
        

    }
}
