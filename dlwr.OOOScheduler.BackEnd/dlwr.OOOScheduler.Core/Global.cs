using Microsoft.Graph;

namespace dlwr.OOOScheduler.Core
{
    public static class Global
    {
        public static class ConnectionStrings
        {
            public static string dlwrConnectionString = "dlwrConnectionString";
        }
        public static class SchemaExtentions
        {
            public static string MessageId = "extktn3y6ls_oooschedulerMessage";
        }
        public static class QueNames
        {
            public const string AutoReplyQue = "auto-reply-queue";
        }
    }
}