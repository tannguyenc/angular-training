using System.ComponentModel.DataAnnotations;

namespace TaskReminderAPI.Models
{
    public class GoogleAuthorizationCode
    {
        public int expires_in { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }
        public string refresh_token { get; set; }
        public string message { get; set; }
    }
}
