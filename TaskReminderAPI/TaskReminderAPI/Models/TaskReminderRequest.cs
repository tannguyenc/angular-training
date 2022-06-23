using System.ComponentModel.DataAnnotations;

namespace TaskReminderAPI.Models
{
    public enum TaskReminderStatus
    {
        All = 0,
        Today = 10,
        Overdue = 20
    }

    public class TaskReminderRequest
    {
        public TaskReminderStatus status { get; set; }
    }
}
