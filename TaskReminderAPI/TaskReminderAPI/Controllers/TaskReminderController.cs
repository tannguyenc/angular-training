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
        public async Task<IEnumerable<TaskReminder>> Get()
            => await _context.TaskReminders.Where(x => !x.Deleted).ToListAsync();

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
        public async Task<IActionResult> Create(TaskReminder taskReminder)
        {
            await _context.TaskReminders.AddAsync(taskReminder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = taskReminder.Id }, taskReminder);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, TaskReminder taskReminder)
        {
            if (id != taskReminder.Id) return BadRequest();

            _context.Entry(taskReminder).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
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
