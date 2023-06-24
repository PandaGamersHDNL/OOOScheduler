using System.ComponentModel.DataAnnotations;

namespace lwr.OOOScheduler.Repositories.Models
{
    public class PlaceHolder
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string DefaultValue { get; set; }
        
        public string Discriminator { get; set; }


    }
}
