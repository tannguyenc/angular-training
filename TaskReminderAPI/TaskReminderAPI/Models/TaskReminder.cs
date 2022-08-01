using System.ComponentModel.DataAnnotations;

namespace TaskReminderAPI.Models
{
    public class TaskReminder
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Done { get; set; }
        public bool Deleted { get; set; }

        public int? CreatedUserId { get; set; }
        public virtual User CreatedUser { get; set; }
    }
}
