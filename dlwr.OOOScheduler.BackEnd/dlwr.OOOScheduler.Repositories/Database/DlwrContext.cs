using dlwr.OOOScheduler.Repositories.Models;
using lwr.OOOScheduler.Repositories.Models;
using Microsoft.EntityFrameworkCore;


namespace dlwr.OOOScheduler.Repositories.Database
{
    public class DlwrContext : DbContext
    {
        public DbSet<DbUser> Users{ get; set; }
        public DbSet<DBMessage> Messages{ get; set; }
        public DbSet<Setting> Settings{ get; set; }
        public DbSet<PlaceHolder> Placeholders{ get; set; }
        public DbSet<CustomPlaceHolder> CustomPlaceholders{ get; set; }

        public DlwrContext(DbContextOptions<DlwrContext> options) : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<PlaceHolder>().HasData(
                new { Name = "startDate", Id = 1, DefaultValue = "Displays the start date and time of the event" },
                new { Name = "endDate", Id = 2, DefaultValue = "Displays the end date and time of the event" }
            );
            //modelBuilder.Entity<PlaceHolder>().HasDiscriminator().IsComplete(false);


            base.OnModelCreating(modelBuilder);
        }

    }
}
public static class PlaceholderDescriminator
{
    public static readonly string basePlace = "PlaceHolder";
    public static readonly string CustomePlace = "CustomPlaceHolder";
}