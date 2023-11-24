using dlwr.OOOScheduler.Core;
using dlwr.OOOScheduler.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Services
{
    public class FakeQueueService : IQueueService
    {
        public void AddToAutoReply(AutoReplyQueInput item)
        {
            return;
        }
    }
}
