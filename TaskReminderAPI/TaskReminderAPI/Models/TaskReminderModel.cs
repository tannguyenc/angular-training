using System.ComponentModel.DataAnnotations;

namespace TaskReminderAPI.Models
{
    public class TaskReminderModel
    {
        public TaskReminderModel()
        {
            Tasks = new List<TaskReminderDetailModel>();
        }

        public DateTime Day { get; set; }
        public string NameDay { get; set; }
        public List<TaskReminderDetailModel> Tasks { get; set; }
    }

    public class TaskReminderDetailModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string NameDay { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime DueDate { get; set; }
        public bool Done { get; set; }
        public bool Deleted { get; set; }
        public bool IsGoogleTask { get; set; }
        public string GoogleTaskListId { get; set; }
    }

    public class GoogleCalendarEvents
    {
        public GoogleCalendarEvents()
        {
            items = new List<GoogleCalendarEventItem>();
        }
        public List<GoogleCalendarEventItem> items { get; set; }
    }

    public class GoogleCalendarEventItem
    {
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
        public string summary { get; set; }
        public string description { get; set; }
        public DateTimeEventItem start { get; set; }
        public DateTimeEventItem end { get; set; }
    }

    public class DateTimeEventItem
    {
        public DateTime dateTime { get; set; }
        public string timeZone { get; set; }
    }

    public class GoogleCalendarTaskList
    {
        public GoogleCalendarTaskList()
        {
            items = new List<GoogleCalendarTaskListItem>();
        }
        public List<GoogleCalendarTaskListItem> items { get; set; }
    }

    public class GoogleCalendarTaskListItem
    {
        public string id { get; set; }
        public string title { get; set; }
    }

    public class GoogleCalendarTasks
    {
        public GoogleCalendarTasks()
        {
            items = new List<GoogleCalendarTaskItem>();
        }
        public List<GoogleCalendarTaskItem> items { get; set; }
    }

    public class GoogleCalendarTaskItem
    {
        public string id { get; set; }
        public string title { get; set; }
        public string notes { get; set; }
        public string status { get; set; } //completed, needsAction
        public DateTime due { get; set; }
        public DateTime updated { get; set; }
        public DateTime completed { get; set; }
    }
}
