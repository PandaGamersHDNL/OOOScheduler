using Azure.Storage.Queues;
using dlwr.OOOScheduler.Core;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Microsoft.Graph.ExternalConnectors;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static dlwr.OOOScheduler.Core.Global;

namespace dlwr.OOOScheduler.Services
{
    public class QueueService
    {
        readonly QueueClient QueueClient;
        public QueueService(QueueClient queueClient) { QueueClient = queueClient; }
        public void AddToAutoReply(AutoReplyQueInput item)
        {
            var messageObj = JsonConvert.SerializeObject(item); 
            Console.WriteLine("erp " + messageObj);
            QueueClient.SendMessageAsync(messageObj).Wait();
        }
    }
}
