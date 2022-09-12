using Microsoft.EntityFrameworkCore;
using TaskReminderAPI.Models;

namespace TaskReminderAPI.Data
{
    public class TaskReminderDbContext : DbContext
    {
        public TaskReminderDbContext(DbContextOptions<TaskReminderDbContext> options)
            :base(options)
        {
        }

        public DbSet<TaskReminder> TaskReminders { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
