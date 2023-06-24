using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Core
{
    public class AutoReplyQueInput
    {
        public MailboxSettings MailboxSettings { get; set; }
        public string UserId { get; set; }
    }
}
