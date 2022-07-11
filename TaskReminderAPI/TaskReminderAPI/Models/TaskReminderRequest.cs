using System.ComponentModel.DataAnnotations;

namespace TaskReminderAPI.Models
{
    public enum TaskReminderStatus
    {
        All = 0,
        Today = 10,
        Overdue = 20,
        Completed = 30,
        Upcoming = 40
    }

    public class TaskReminderRequest
    {
        public TaskReminderStatus status { get; set; }
    }

    public class AddTaskReminderRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
    }

    public class UpdateTaskReminderRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
    }
}
