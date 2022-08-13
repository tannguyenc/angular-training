﻿using System.ComponentModel.DataAnnotations;

namespace TaskReminderAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Created { get; set; }
        public bool Deleted { get; set; }
        public string PhotoUrl { get; set; }
        public string AccessTokenGoogle { get; set; }
        public string RefreshTokenGoogle { get; set; }
        public DateTime ExpiresInGoogle { get; set; }
    }
}
