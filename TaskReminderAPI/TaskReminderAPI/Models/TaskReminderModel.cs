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
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameDay { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Done { get; set; }
        public bool Deleted { get; set; }
    }
}
