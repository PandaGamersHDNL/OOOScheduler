using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Azure.Identity;
using Microsoft.Extensions.DependencyInjection;
using dlwr.OOOScheduler.Services;
using dlwr.OOOScheduler.Repositories.Database;
using Microsoft.EntityFrameworkCore;
using dlwr.OOOScheduler.WebJobs;
using Microsoft.Extensions.Configuration;
using dlwr.OOOScheduler.Core;
using dlwr.OOOScheduler.Services.Contracts;
using Azure.Storage.Queues;
using static dlwr.OOOScheduler.Core.Global;

public class Program
{
    static async Task Main(string[] args)
    {



        var builder = new HostBuilder();
        builder.ConfigureAppConfiguration((a, b) =>
        {
            b.AddUserSecrets<Program>();
        });
        //builder.ConfigureHostConfiguration(host => { host.});
        builder.ConfigureServices((context, services) =>
         {
             //context.Configuration
             var cns = context.Configuration.GetValue<string>(Global.ConnectionStrings.dlwrConnectionString);
             var storageConStr = context.Configuration.GetValue<string>("AzureWebJobsStorage");
             CreateQueue(Global.QueNames.AutoReplyQue, storageConStr);
             var scopes = new[] { "https://graph.microsoft.com/.default" };
             var options = new TokenCredentialOptions
             {
                 AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
             };
             
             var clientSecretCredential = new ClientSecretCredential(
                 context.Configuration.GetValue<string>("TenantId"),
                 context.Configuration.GetValue<string>("ClientId"),
                 context.Configuration.GetValue<string>("ClientSecret"), options);

             var graphClient = new GraphServiceClient(clientSecretCredential, scopes);

             var dataService = new AppDataService(graphClient);
             //Console.WriteLine("cns " + cns);

             services.AddDbContext<DlwrContext>(builder =>
             {
                 builder.UseSqlServer(cns, providerOptions =>
                 providerOptions.EnableRetryOnFailure()

                );
             });
             services.AddSingleton(dataService);
             services.AddScoped<IDBService, DBService>();


         });

        builder.ConfigureWebJobs(b =>
        {
            b.AddAzureStorageQueues();
            b.AddAzureStorageCoreServices();
            b.AddTimers(); // enables the timer triggered functions
        });
        builder.UseEnvironment("development");
        builder.ConfigureLogging((context, b) =>
        {
            b.AddConsole();
        });
        builder.UseConsoleLifetime();
        var host = builder.Build();

        if (host != null)
        {
            await host.RunAsync();
        }
    }


    public static bool CreateQueue(string queueName,string connectionString)
    {
        try
        {
            // Instantiate a QueueClient which will be used to create and manipulate the queue
            QueueClient queueClient = new QueueClient(connectionString, queueName);

            // Create the queue
            queueClient.CreateIfNotExists();

            if (queueClient.Exists())
            {
                Console.WriteLine($"Queue created: '{queueClient.Name}'");
                return true;
            }
            else
            {
                Console.WriteLine($"Make sure the Azurite storage emulator running and try again.");
                return false;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}\n\n");
            Console.WriteLine($"Make sure the Azurite storage emulator running and try again.");
            return false;
        }
    }
}

