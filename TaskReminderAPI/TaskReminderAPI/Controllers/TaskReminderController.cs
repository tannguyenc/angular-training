using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text.Json;
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
        public async Task<List<TaskReminderDetailModel>> Get([FromQuery] GetTaskReminderRequest request)
        {
            var results = new List<TaskReminderDetailModel>();
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId);
            if (user == null)
                return results;
            var resp = await _context.TaskReminders.Where(x => !x.Deleted && x.DueDate.HasValue && request.UserId == x.CreatedUserId).ToListAsync();
            var datas = resp.Select(x => new TaskReminderResponse
            {
                Id = x.Id,
                DueDate = x.DueDate,
                Created = x.Created,
                CreatedUserId = x.CreatedUserId,
                Deleted = x.Deleted,
                Description = x.Description,
                Done = x.Done,
                IsGoogleTask = false,
                Name = x.Name
            }).ToList();

            //var events = await GetEventGoogleCalendarAsync(user, datas.Count + 1);
            var tasks = await GetGoogleCalendarTasksAsync(user, datas.Count);
            datas.AddRange(tasks);
            if (datas.Any())
            {
                var timeNow = DateTime.Now.Date;
                switch (request.Status)
                {
                    case TaskReminderStatus.All:
                        datas = datas.Where(x => !x.Done).ToList();
                        break;
                    case TaskReminderStatus.Upcoming:
                        datas = datas.Where(x => !x.Done && x.DueDate.HasValue && x.DueDate.Value.Date > DateTime.Now.Date).ToList();
                        break;
                    case TaskReminderStatus.Today:
                        datas = datas.Where(x => !x.Done && x.DueDate.HasValue && x.DueDate.Value.Date == DateTime.Now.Date).ToList();
                        break;
                    case TaskReminderStatus.Overdue:
                        datas = datas.Where(x => !x.Done && x.DueDate.HasValue && x.DueDate.Value.Date < DateTime.Now.Date).ToList();
                        break;
                    case TaskReminderStatus.Completed:
                        datas = datas.Where(x => x.Done).ToList();
                        break;
                }

                results = datas.OrderBy(x => x.DueDate).Select(x => new TaskReminderDetailModel
                {
                    IsGoogleTask = x.IsGoogleTask,
                    Created = x.Created,
                    Deleted = x.Deleted,
                    Description = x.Description,
                    Done = x.Done,
                    DueDate = x.DueDate.Value,
                    Id = x.Id,
                    Name = x.Name,
                    NameDay = x.Done ? TaskReminderStatus.Completed.ToString() : x.DueDate.Value.Date < timeNow ? 
                    TaskReminderStatus.Overdue.ToString() : x.DueDate.Value.Date == timeNow ?
                    TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString(),
                }).ToList();
            }

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
                DueDate = task.DueDate.ToLocalTime(),
                Name = task.Name,
                CreatedUserId = task.UserId
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
                NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                    TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                    TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString()
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
            taskReminder.DueDate = task.DueDate.ToLocalTime();

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
                NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                    TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                    TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString()
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
                NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                    TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                    TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString()
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

        private async Task<List<TaskReminder>> GetEventGoogleCalendarAsync(User user, int totalTask)
        {
            var results = new List<TaskReminder>();

            using (var client = new HttpClient())
            {
                var events = new GoogleCalendarEvents();
                //set request
                var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10" +
                    "&orderBy=startTime&singleEvents=true&timeMin=2022-08-05T04:52:05.504Z&key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                //set Header
                request.Headers.Authorization = new AuthenticationHeaderValue(
                    "Bearer", user.AccessToken);
                //get response
                var response = await client.SendAsync(request);

                response.EnsureSuccessStatusCode();

                var responseStream = await response.Content.ReadAsStringAsync();
                if(!string.IsNullOrEmpty( responseStream))
                {
                    events = JsonConvert.DeserializeObject<GoogleCalendarEvents>(responseStream);
                }
                
                if(events!= null && events.items.Any())
                {
                    Random rnd = new Random();

                    for(var i = 0; i < events.items.Count; i++)
                    {
                        var x = events.items[i];

                        results.Add(new TaskReminder
                        {
                            Created = x.created,
                            Deleted = false,
                            Description = "demo",
                            Done = false,
                            DueDate = x.start.dateTime,
                            Name = x.summary,
                            CreatedUserId = user.Id,
                            Id = i + totalTask
                        }) ;
                    }

                    //results = events.items.Select(x=> new TaskReminder
                    //{
                    //    Created = x.created,
                    //    Deleted = false,
                    //    Description = x.description,
                    //    Done = false,
                    //    DueDate = x.start.dateTime,
                    //    Name = x.summary,
                    //    CreatedUserId = user.Id,
                    //    Id = rnd
                    //}).ToList();
                }
            }

            return results;
        }

        private async Task<List<TaskReminderResponse>> GetGoogleCalendarTasksAsync(User user, int totalTask)
        {
            var results = new List<TaskReminderResponse>();
            var idTask = totalTask++;
            try
            {
                var taskLists = await GetGoogleCalendarTaskListAsync(user);
                if (taskLists.Any())
                {
                    using (var client = new HttpClient())
                    {
                        foreach (var taskList in taskLists)
                        {
                            var tasks = new GoogleCalendarTasks();
                            //set request
                            var request = new HttpRequestMessage(HttpMethod.Get, $"https://tasks.googleapis.com/tasks/v1/lists/{taskList.id}/tasks" +
                                "?maxResults=50&showCompleted=true&showHidden=true&key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");

                            //set Header
                            request.Headers.Authorization = new AuthenticationHeaderValue(
                                "Bearer", user.AccessToken);
                            //get response
                            var response = await client.SendAsync(request);

                            response.EnsureSuccessStatusCode();

                            var responseStream = await response.Content.ReadAsStringAsync();
                            if (!string.IsNullOrEmpty(responseStream))
                            {
                                tasks = JsonConvert.DeserializeObject<GoogleCalendarTasks>(responseStream);
                            }

                            if (tasks != null && tasks.items.Any())
                            {
                                for (var i = 0; i < tasks.items.Count; i++)
                                {
                                    var x = tasks.items[i];

                                    results.Add(new TaskReminderResponse
                                    {
                                        Created = x.updated,
                                        Deleted = false,
                                        Description = x.notes,
                                        Done = x.status == "completed",
                                        DueDate = x.due,
                                        Name = x.title,
                                        CreatedUserId = user.Id,
                                        Id = idTask++,
                                        IsGoogleTask = true
                                    });
                                }

                                //results = events.items.Select(x=> new TaskReminder
                                //{
                                //    Created = x.created,
                                //    Deleted = false,
                                //    Description = x.description,
                                //    Done = false,
                                //    DueDate = x.start.dateTime,
                                //    Name = x.summary,
                                //    CreatedUserId = user.Id,
                                //    Id = rnd
                                //}).ToList();
                            }
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                results = new List<TaskReminderResponse>();
            }

            return results;
        }

        private async Task<List<GoogleCalendarTaskListItem>> GetGoogleCalendarTaskListAsync(User user)
        {
            var result = new List<GoogleCalendarTaskListItem>();

            try
            {
                using (var client = new HttpClient())
                {
                    var taskList = new GoogleCalendarTaskList();
                    //set request
                    var request = new HttpRequestMessage(HttpMethod.Get, "https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                    //set Header
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", user.AccessToken);
                    //get response
                    var response = await client.SendAsync(request);

                    response.EnsureSuccessStatusCode();

                    var responseStream = await response.Content.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(responseStream))
                    {
                        taskList = JsonConvert.DeserializeObject<GoogleCalendarTaskList>(responseStream);
                    }

                    if (taskList != null && taskList.items.Any())
                    {
                        result = taskList.items.Select(x => new GoogleCalendarTaskListItem
                        {
                            id = x.id,
                            title = x.title,
                        }).ToList();
                    }
                }
            }
            catch(Exception ex)
            {
                result = new List<GoogleCalendarTaskListItem>();
            }
            

            return result;
        }
    }
}
