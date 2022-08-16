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

    public class TaskReminderResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Done { get; set; }
        public bool Deleted { get; set; }
        public string GoogleTaskListId { get; set; }
        public bool IsGoogleTask { get; set; }

        public int? CreatedUserId { get; set; }
    }

    public class GetTaskReminderRequest
    {
        public TaskReminderStatus Status { get; set; }
        public int UserId { get; set; }
    }

    public class GetTaskReminderDetailRequest
    {
        public int UserId { get; set; }
        public string? GoogleTaskListId { get; set; }
        public bool IsGoogleTask { get; set; }

    }
    public class TaskReminderRequest
    {
        public TaskReminderStatus status { get; set; }
    }

    public class AddOrUpdateTaskReminderRequest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int UserId { get; set; }
        public string GoogleTaskListId { get; set; }
        public bool IsGoogleTask { get; set; }
        public bool IsDone { get; set; }
    }
}
