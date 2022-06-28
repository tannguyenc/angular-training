using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskReminderAPI.Data;
using TaskReminderAPI.Models;

namespace TaskReminderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskReminderController : ControllerBase
    {
        private readonly TaskReminderDbContext _context;

        public TaskReminderController(TaskReminderDbContext context) => _context = context;

        [HttpGet]
        public async Task<List<TaskReminderDetailModel>> Get([FromQuery] TaskReminderStatus request)
        {
            var results = new List<TaskReminderDetailModel>();
            var datas = await _context.TaskReminders.Where(x => !x.Deleted && x.DueDate.HasValue).ToListAsync();
            if (datas.Any())
            {
                var timeNow = DateTime.Now.Date;
                switch (request)
                {
                    case TaskReminderStatus.All:
                        datas = datas.Where(x => x.DueDate.Value.Date >= DateTime.Now.Date).ToList();
                        break;
                    case TaskReminderStatus.Today:
                        datas = datas.Where(x => x.DueDate.Value.Date == DateTime.Now.Date).ToList();
                        break;
                    case TaskReminderStatus.Overdue:
                        datas = datas.Where(x => x.DueDate.Value.Date < DateTime.Now.Date).ToList();
                        break;
                }

                results = datas.OrderBy(x => x.DueDate).Select(x => new TaskReminderDetailModel
                {
                    Created = x.Created,
                    Deleted = x.Deleted,
                    Description = x.Description,
                    Done = x.Done,
                    DueDate = x.DueDate.Value,
                    Id = x.Id,
                    Name = x.Name,
                    NameDay = x.DueDate.Value.Date < timeNow ? "Overdue" : x.DueDate.Value.Date == timeNow ? "Today" : "Upcoming",
                }).ToList();
            }

            return results;
            //if (datas.Any())
            //{
            //    var timeNow = DateTime.Now.Date;
            //    switch (request)
            //    {
            //        case TaskReminderStatus.All:
            //            datas = datas.Where(x => x.DueDate.Value.Date >= DateTime.Now.Date).ToList();
            //            break;
            //        case TaskReminderStatus.Today:
            //            datas = datas.Where(x => x.DueDate.Value.Date == DateTime.Now.Date).ToList();
            //            break;
            //        case TaskReminderStatus.Overdue:
            //            datas = datas.Where(x => x.DueDate.Value.Date < DateTime.Now.Date).ToList();
            //            break;
            //    }

            //    results = datas.GroupBy(x => x.DueDate.Value.Date).Select(x => new TaskReminderModel
            //    {
            //        Day = x.Key,
            //        NameDay = x.Key < timeNow ? "Overdue" : x.Key == timeNow ? "Today" : "Upcoming",
            //        Tasks = x.Select(y => new TaskReminderDetailModel
            //        {
            //            Id = y.Id,
            //            Created = y.Created,
            //            Deleted = y.Deleted,
            //            Description = y.Description,
            //            Done = y.Done,
            //            DueDate = y.DueDate,
            //            Name = y.Name,
            //        }).ToList()
            //    }).ToList();
            //}

            return results;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TaskReminder), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var taskReminder = await _context.TaskReminders.FirstOrDefaultAsync(x => x.Id == id && !x.Deleted);
            return taskReminder == null ? NotFound() : Ok(taskReminder);
        }

        [HttpGet("search/{name}")]
        [ProducesResponseType(typeof(TaskReminder), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByTitle(string name)
        {
            var taskReminder = await _context.TaskReminders.FirstOrDefaultAsync(c => c.Name == name && !c.Deleted);
            return taskReminder == null ? NotFound() : Ok(taskReminder);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(AddTaskReminderRequest task)
        {
            var taskReminder = new TaskReminder
            {
                Created = DateTime.Now,
                Deleted = false,
                Description = task.Description,
                Done = false,
                DueDate = task.DueDate,
                Name = task.Name,
            };

            await _context.TaskReminders.AddAsync(taskReminder);
            await _context.SaveChangesAsync();
            var timeNow = DateTime.Now.Date;

            return Ok(new TaskReminderDetailModel
            {
                Created = taskReminder.Created,
                Deleted = taskReminder.Deleted,
                Description = taskReminder.Description,
                Done = taskReminder.Done,
                DueDate = taskReminder.DueDate.Value,
                Id = taskReminder.Id,
                Name = taskReminder.Name,
                NameDay = taskReminder.DueDate.Value.Date < timeNow ? "Overdue" : taskReminder.DueDate.Value.Date == timeNow ? "Today" : "Upcoming",
            });

            //return CreatedAtAction(nameof(GetById), new { id = taskReminder.Id }, taskReminder);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, UpdateTaskReminderRequest task)
        {
            if (id != task.Id) return BadRequest();

            var taskReminder = await _context.TaskReminders.FindAsync(id);
            if (taskReminder == null) return NotFound();
            taskReminder.Name = task.Name;
            taskReminder.Description = task.Description;
            taskReminder.DueDate = task.DueDate;

            _context.TaskReminders.Update(taskReminder);
            await _context.SaveChangesAsync();
            var timeNow = DateTime.Now.Date;

            return Ok(new TaskReminderDetailModel
            {
                Created = taskReminder.Created,
                Deleted = taskReminder.Deleted,
                Description = taskReminder.Description,
                Done = taskReminder.Done,
                DueDate = taskReminder.DueDate.Value,
                Id = taskReminder.Id,
                Name = taskReminder.Name,
                NameDay = taskReminder.DueDate.Value.Date < timeNow ? "Overdue" : taskReminder.DueDate.Value.Date == timeNow ? "Today" : "Upcoming",
            });
            //return Ok(taskReminder);
        }

        [HttpPut("{id}/done")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateDoneStatus(int id, [FromQuery] bool isDone)
        {
            var taskReminder = await _context.TaskReminders.FirstOrDefaultAsync(x => x.Id == id && !x.Deleted);
            if (taskReminder == null) return NotFound();

            taskReminder.Done = isDone;
            _context.TaskReminders.Update(taskReminder);
            await _context.SaveChangesAsync();
            var timeNow = DateTime.Now.Date;
            return Ok(new TaskReminderDetailModel
            {
                Created = taskReminder.Created,
                Deleted = taskReminder.Deleted,
                Description = taskReminder.Description,
                Done = taskReminder.Done,
                DueDate = taskReminder.DueDate.Value,
                Id = taskReminder.Id,
                Name = taskReminder.Name,
                NameDay = taskReminder.DueDate.Value.Date < timeNow ? "Overdue" : taskReminder.DueDate.Value.Date == timeNow ? "Today" : "Upcoming",
            });
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var taskReminderToDelete = await _context.TaskReminders.FindAsync(id);
            if (taskReminderToDelete == null) return NotFound();
            taskReminderToDelete.Deleted = true;
            _context.TaskReminders.Update(taskReminderToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
