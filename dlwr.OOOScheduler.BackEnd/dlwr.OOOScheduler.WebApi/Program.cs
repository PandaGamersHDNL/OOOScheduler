using Azure.Identity;
using Azure.Storage.Queues;
using dlwr.OOOScheduler.Core;
using dlwr.OOOScheduler.Repositories.Database;
using dlwr.OOOScheduler.Services;
using dlwr.OOOScheduler.Services.Contracts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using Microsoft.Identity.Web;


namespace dlwr.OOOScheduler.WebApi
{
    public class Program
    {

        public static void Main(string[] args)
        {
            var builder = Microsoft.AspNetCore.Builder.WebApplication.CreateBuilder(args);
            //Console.WriteLine(builder.Configuration[Global.ConnectionStrings.dlwrConnectionString]);
            // Add services to the container.
            builder.Services.AddControllers();
            // Add authentication

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"))
                .EnableTokenAcquisitionToCallDownstreamApi()
                .AddMicrosoftGraph(builder.Configuration.GetSection("MsGraph"))
                .AddInMemoryTokenCaches();
            //builder.Services.AddMicrosoftGraphClient()
            var queueClient = new QueueClient(
                builder.Configuration.GetValue("AzureWebJobsStorage", ""),
                "auto-reply-queue", new QueueClientOptions { MessageEncoding = QueueMessageEncoding.Base64 });


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IDBService, DBService>();
            var queueService = new QueueService(queueClient);
            builder.Services.AddSingleton(queueService);
            var dlwrConnectionString = builder.Configuration.GetConnectionString(Global.ConnectionStrings.dlwrConnectionString);
            if (string.IsNullOrEmpty(dlwrConnectionString))
            {
                dlwrConnectionString = builder.Configuration.GetValue<string>(Global.ConnectionStrings.dlwrConnectionString);
            }
            
            builder.Services.AddDbContext<DlwrContext>(builder =>
            {
                builder.UseSqlServer(dlwrConnectionString,
                    providerOptions => providerOptions.EnableRetryOnFailure()
                );
            });
            // Cors
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        //TODO add to appconfig
                        builder.WithOrigins(
                            "http://localhost:5173",
                            "https://localhost:7074",
                            "https://dw-oooscheduler-devjj-as.azurewebsites.net",
                            "https://polite-wave-0bc1ddf03.2.azurestaticapps.net"
                        ).AllowCredentials()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });


            });
            var msclient = builder.Services.BuildServiceProvider().GetService<GraphServiceClient>();

            builder.Services.AddSingleton<IDataService>(new DataService(msclient, queueService));
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseRouting();
            app.UseHttpsRedirection();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            //app.UseStaticFiles();
            //app.UseDefaultFiles();
            //app.UseStatusCodePagesWithRedirects("/");

            app.MapControllers();

            app.Run();
        }
    }
}