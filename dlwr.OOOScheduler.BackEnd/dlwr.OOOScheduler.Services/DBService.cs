using dlwr.OOOScheduler.Repositories.Database;
using dlwr.OOOScheduler.Repositories.Models;
using dlwr.OOOScheduler.Services.Contracts;
using lwr.OOOScheduler.Repositories.Models;
using Microsoft.EntityFrameworkCore;


namespace dlwr.OOOScheduler.Services
{
    public class DBService : IDBService
    {
        DlwrContext _Context { get; set; }
        public DBService(DlwrContext Context)
        {
            _Context = Context;
        }

        public void PostUserInfo(DbUser user)
        {
            Console.WriteLine(user.Messages);
            _Context.Users.Add(user);
            _Context.SaveChanges();
        }

        public async Task<CheckUser?> CheckUser(string id)
        {

            try
            {
                //handle returning messages and placeholders
                var user = await _Context.Users
                    .Include(v => v.Setting)
                    .Include(v => v.CustomPlaceholders)
                    .Include(v => v.Messages)
                    .AsNoTracking()
                    .FirstAsync(v => v.Id == id);

                var outUser = new OutputUser
                {
                    CustomPlaceholders = user.CustomPlaceholders,
                    Id = user.Id,
                    Messages = user.Messages,
                    Setting = user.Setting
                };
                outUser.PlaceHolders = await _Context.Placeholders.Where(v => v.Discriminator == PlaceholderDescriminator.basePlace).ToListAsync();
                Console.WriteLine("eep old user", user.CustomPlaceholders.Count);
                return new CheckUser { outputUser = outUser, isNew = false };
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e}");
                var newUser = new DbUser
                {
                    Id = id,
                    Setting = new Setting
                    {
                        IsEnabled = false,
                        Threshold = 0
                    },
                    Messages = new List<DBMessage>(),
                    CustomPlaceholders = new List<CustomPlaceHolder>()
                };
                _Context.Users.Add(newUser);
                _Context.SaveChanges();
                var outUser = new OutputUser
                {
                    CustomPlaceholders = newUser.CustomPlaceholders,
                    Id = newUser.Id,
                    Messages = newUser.Messages,
                    Setting = newUser.Setting
                };

                outUser.PlaceHolders = _Context.Placeholders.ToList();
                Console.WriteLine("eep new user");
                return new CheckUser { outputUser = outUser, isNew = true };

            }
        }

        public async Task<IEnumerable<OutputUser>> GetAllUsers()
        {
            var user = await _Context.Users
                    .Include(v => v.Setting)
                    .Include(v => v.CustomPlaceholders)
                    .Include(v => v.Messages).Where(v=> v.Setting.IsEnabled == true)
                    .AsNoTracking()
                    .ToListAsync();
            var placeholders = await _Context.Placeholders.Where(v => v.Discriminator == PlaceholderDescriminator.basePlace).ToListAsync();

            var outUsers = user.ConvertAll((u) =>
           {
               return new OutputUser
               {
                   CustomPlaceholders = u.CustomPlaceholders,
                   Id = u.Id,
                   Messages = u.Messages,
                   Setting = u.Setting,
                   PlaceHolders = placeholders
               };
           });
            return outUsers;
        }

        public async Task<Setting?> UpdateSettings(Setting setting)
        {
            var settings = await _Context.Settings.AsNoTracking().Where((v) => v.Id == setting.Id && v.UserId == setting.UserId).ToListAsync();
            if (settings.Count == 0) return null;
            _Context.Settings.Update(setting);
            _Context.SaveChanges();
            return setting;
        }

        public CustomPlaceHolder CreatePlaceholder(CustomPlaceHolder item)
        {
            _Context.CustomPlaceholders.Add(item);
            _Context.SaveChanges();
            return item;
        }

        public void DeletePlaceholder(string placeholderId, string userId)
        {
            //return null or something to indicate failed delete
            _Context.CustomPlaceholders.Where((v) => v.Id == Int32.Parse(placeholderId) && v.DbUserId == userId).ExecuteDelete();
        }

        public CustomPlaceHolder? UpdatePlaceholder(CustomPlaceHolder item)
        {
            try
            {

                Console.WriteLine("eep update called", item.Id);
                _Context.CustomPlaceholders.Where(x => x.Id == item.Id && item.DbUserId == x.DbUserId);
                _Context.CustomPlaceholders.Update(item);
                _Context.SaveChanges();
                return item;
            }
            catch
            {
                return null;
            }
        }

        public DBMessage CreateMessage(DBMessage item)
        {
            _Context.Messages.Add(item);
            _Context.SaveChanges();
            return item;
        }

        public DBMessage? UpdateMessage(DBMessage item)
        {
            try
            {
                Console.WriteLine("eep update called", item.Id);
                _Context.Messages.Where((v) => item.Id == v.Id && item.UserId == v.UserId);
                _Context.Messages.Update(item);
                _Context.SaveChanges();
                return item;
            }
            catch
            {
                return null;
            }
        }

        public void DeleteMessage(string placeholderId, string userId)
        {
            //return null or something to indicate failed delete
            _Context.Messages.Where((v) => v.Id == Int32.Parse(placeholderId) && v.UserId == userId).ExecuteDelete();
        }

        public async Task<DBMessage?> GetMessage(string id)
        {
            try
            {
                return await _Context.Messages.Where((v) => v.Id == Int32.Parse(id)).FirstAsync();
            }
            catch
            {
                return null;
            }
        }
    }

    public class OutputUser : DbUser
    {
        public ICollection<PlaceHolder>? PlaceHolders { get; set; }
    }

    public class CheckUser
    {
        public OutputUser outputUser { get; set; }
        public bool isNew { get; set; }
    }
}
