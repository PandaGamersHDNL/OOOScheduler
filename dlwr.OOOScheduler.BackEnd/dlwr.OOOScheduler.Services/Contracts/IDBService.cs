using dlwr.OOOScheduler.Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Services.Contracts
{
    public interface IDBService
    {
        Task<CheckUser?> CheckUser(string id);
        Task<IEnumerable<OutputUser>> GetAllUsers();
        Task<DBMessage?> GetMessage(string id);
        CustomPlaceHolder CreatePlaceholder(CustomPlaceHolder item);
        DBMessage CreateMessage(DBMessage item);
        Task<Setting?> UpdateSettings(Setting setting);
        CustomPlaceHolder? UpdatePlaceholder(CustomPlaceHolder item);
        DBMessage? UpdateMessage(DBMessage item);
        void DeletePlaceholder(string placeholderId, string userId);
        void DeleteMessage(string placeholderId, string userId);
    }
}
