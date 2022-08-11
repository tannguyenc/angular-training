using System;

namespace TaskReminderAPI.Models
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool Deleted { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }

        public AuthenticateResponse(User user, string token)
        {
            Id = user.Id;
            Email = user.Email;
            Deleted = user.Deleted;
            FullName = user.FullName;
            Token = token;
            PhotoUrl = user.PhotoUrl;
        }
    }
}
