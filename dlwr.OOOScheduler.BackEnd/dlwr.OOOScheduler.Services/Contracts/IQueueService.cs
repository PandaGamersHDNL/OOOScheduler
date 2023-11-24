using dlwr.OOOScheduler.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Services.Contracts
{
    public interface IQueueService
    {
        public void AddToAutoReply(AutoReplyQueInput item);
    }
}
