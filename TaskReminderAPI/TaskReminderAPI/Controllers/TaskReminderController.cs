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
                Id = x.Id.ToString(),
                DueDate = x.DueDate,
                Created = x.Created,
                CreatedUserId = x.CreatedUserId,
                Deleted = x.Deleted,
                Description = x.Description,
                Done = x.Done,
                IsGoogleTask = false,
                Name = x.Name,
                GoogleTaskListId = ""
            }).ToList();

            //var events = await GetEventGoogleCalendarAsync(user, datas.Count + 1);
            var tasks = await GetGoogleCalendarTasksAsync(user);
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
                    GoogleTaskListId = x.GoogleTaskListId,
                    IsGoogleTask = x.IsGoogleTask,
                    Created = x.Created,
                    Deleted = x.Deleted,
                    Description = x.Description,
                    Done = x.Done,
                    DueDate = x.DueDate.Value,
                    Id = x.Id.ToString(),
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
        public async Task<IActionResult> GetById(string id, [FromQuery] GetTaskReminderDetailRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId);
            if (user == null)
                return NotFound();

            if (request.IsGoogleTask)
            {
                return Ok(await GetGoogleTaskDetail(user, id, request.GoogleTaskListId));
            }
            else
            {
                int idTask = 0;
                int.TryParse(id, out idTask);
                var timeNow = DateTime.Now.Date;
                var taskReminder = await _context.TaskReminders.FirstOrDefaultAsync(x => x.Id == idTask && !x.Deleted);
                return taskReminder == null ? NotFound() : Ok(new TaskReminderDetailModel
                {
                    GoogleTaskListId = "",
                    IsGoogleTask = false,
                    Created = taskReminder.Created,
                    Deleted = taskReminder.Deleted,
                    Description = taskReminder.Description,
                    Done = taskReminder.Done,
                    DueDate = taskReminder.DueDate.Value,
                    Id = taskReminder.Id.ToString(),
                    Name = taskReminder.Name,
                    NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                        TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                        TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString(),
                });
            }
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
        public async Task<IActionResult> Create([FromBody] AddOrUpdateTaskReminderRequest task)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == task.UserId);
            if (user == null)
                return NotFound();

            if (task.IsGoogleTask)
            {
                return Ok(await CreateGoogleTask(user, task));
            }
            else
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
                    IsGoogleTask = false,
                    GoogleTaskListId = "",
                    Created = taskReminder.Created,
                    Deleted = taskReminder.Deleted,
                    Description = taskReminder.Description,
                    Done = taskReminder.Done,
                    DueDate = taskReminder.DueDate.Value,
                    Id = taskReminder.Id.ToString(),
                    Name = taskReminder.Name,
                    NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                        TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                        TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString()
                });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(string id, [FromBody] AddOrUpdateTaskReminderRequest task)
        {
            if (id != task.Id) return BadRequest();

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == task.UserId);
            if (user == null)
                return NotFound();

            if (task.IsGoogleTask)
            {
                return Ok(await UpdateGoogleTask(user, task));
            }
            else
            {
                int idTask = 0;
                int.TryParse(id, out idTask);

                var taskReminder = await _context.TaskReminders.FindAsync(idTask);
                if (taskReminder == null) return NotFound();
                taskReminder.Name = task.Name;
                taskReminder.Description = task.Description;
                taskReminder.DueDate = task.DueDate.ToLocalTime();

                _context.TaskReminders.Update(taskReminder);
                await _context.SaveChangesAsync();
                var timeNow = DateTime.Now.Date;

                return Ok(new TaskReminderDetailModel
                {
                    GoogleTaskListId = "",
                    IsGoogleTask = false,
                    Created = taskReminder.Created,
                    Deleted = taskReminder.Deleted,
                    Description = taskReminder.Description,
                    Done = taskReminder.Done,
                    DueDate = taskReminder.DueDate.Value,
                    Id = id,
                    Name = taskReminder.Name,
                    NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                        TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                        TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString()
                });
            }
        }

        [HttpPut("{id}/done")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateDoneStatus(string id, [FromBody] AddOrUpdateTaskReminderRequest task)
        {
            if (id != task.Id) return BadRequest();

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == task.UserId);
            if (user == null)
                return NotFound();

            if (task.IsGoogleTask)
            {
                return Ok(await UpdateGoogleTask(user, task));
            }
            else
            {
                int idTask = 0;
                int.TryParse(id, out idTask);

                var taskReminder = await _context.TaskReminders.FirstOrDefaultAsync(x => x.Id == idTask && !x.Deleted);
                if (taskReminder == null) return NotFound();

                taskReminder.Done = task.IsDone;
                _context.TaskReminders.Update(taskReminder);
                await _context.SaveChangesAsync();
                var timeNow = DateTime.Now.Date;
                return Ok(new TaskReminderDetailModel
                {
                    GoogleTaskListId = "",
                    IsGoogleTask = false,
                    Created = taskReminder.Created,
                    Deleted = taskReminder.Deleted,
                    Description = taskReminder.Description,
                    Done = taskReminder.Done,
                    DueDate = taskReminder.DueDate.Value,
                    Id = taskReminder.Id.ToString(),
                    Name = taskReminder.Name,
                    NameDay = taskReminder.Done ? TaskReminderStatus.Completed.ToString() : taskReminder.DueDate.Value.Date < timeNow ?
                        TaskReminderStatus.Overdue.ToString() : taskReminder.DueDate.Value.Date == timeNow ?
                        TaskReminderStatus.Today.ToString() : TaskReminderStatus.Upcoming.ToString()
                });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string id, [FromBody] AddOrUpdateTaskReminderRequest task)
        {
            if (id != task.Id) return BadRequest();

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == task.UserId);
            if (user == null)
                return NotFound();

            if (task.IsGoogleTask)
            {
                var result = await DeleteGoogleTask(user, id, task.GoogleTaskListId);
                if (result)
                    return NoContent();
                return BadRequest();
            }
            else
            {
                int idTask = 0;
                int.TryParse(id, out idTask); var taskReminderToDelete = await _context.TaskReminders.FindAsync(id);
                if (taskReminderToDelete == null) return NotFound();
                taskReminderToDelete.Deleted = true;
                _context.TaskReminders.Update(taskReminderToDelete);
                await _context.SaveChangesAsync();

                return NoContent();
            }
        }

        [HttpGet("googleTaskList")]
        public async Task<List<GoogleCalendarTaskListItem>> GetGoogleCalendarTaskList([FromQuery] int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                return new List<GoogleCalendarTaskListItem>();

            return await GetGoogleCalendarTaskListAsync(user);
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
                    "Bearer", user.AccessTokenGoogle);
                //get response
                var response = await client.SendAsync(request);

                response.EnsureSuccessStatusCode();

                var responseStream = await response.Content.ReadAsStringAsync();
                if (!string.IsNullOrEmpty(responseStream))
                {
                    events = JsonConvert.DeserializeObject<GoogleCalendarEvents>(responseStream);
                }

                if (events != null && events.items.Any())
                {
                    Random rnd = new Random();

                    for (var i = 0; i < events.items.Count; i++)
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

            return results;
        }

        private async Task<List<TaskReminderResponse>> GetGoogleCalendarTasksAsync(User user)
        {
            var results = new List<TaskReminderResponse>();
            var accessTokenGoogle = await GetGoogleAccessToken(user);

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
                                "Bearer", accessTokenGoogle);
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
                                results = tasks.items.Select(x => new TaskReminderResponse
                                {
                                    Created = x.updated,
                                    Deleted = false,
                                    Description = x.notes,
                                    Done = x.status == "completed",
                                    DueDate = x.due,
                                    Name = x.title,
                                    CreatedUserId = user.Id,
                                    Id = x.id,
                                    IsGoogleTask = true,
                                    GoogleTaskListId = taskList.id,
                                }).ToList();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                results = new List<TaskReminderResponse>();
            }

            return results;
        }

        private async Task<List<GoogleCalendarTaskListItem>> GetGoogleCalendarTaskListAsync(User user)
        {
            var result = new List<GoogleCalendarTaskListItem>();

            var accessTokenGoogle = await GetGoogleAccessToken(user);

            try
            {
                using (var client = new HttpClient())
                {
                    var taskList = new GoogleCalendarTaskList();
                    //set request
                    var request = new HttpRequestMessage(HttpMethod.Get, "https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                    //set Header
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", accessTokenGoogle);
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
            catch (Exception ex)
            {
                result = new List<GoogleCalendarTaskListItem>();
            }


            return result;
        }

        private async Task<GoogleAuthorizationCode> GoogleAccessTokenFromRefreshToken(string refreshToken)
        {
            var result = new GoogleAuthorizationCode
            {
                refresh_token = refreshToken,
            };

            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var request = new HttpRequestMessage(new HttpMethod("POST"), $"https://oauth2.googleapis.com/token"))
                    {
                        var json = JsonConvert.SerializeObject(new
                        {
                            refresh_token = refreshToken,
                            client_id = "563919799549-l37pui6624jnr4j39n20aqvg83jvk54b.apps.googleusercontent.com",
                            client_secret = "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",
                            grant_type = "refresh_token",
                            redirect_uri = "http://localhost:4200"
                        });
                        request.Content = new StringContent(json);
                        request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                        var response = await httpClient.SendAsync(request);

                        if (response.IsSuccessStatusCode)
                        {
                            // Get the response
                            var customerJsonString = await response.Content.ReadAsStringAsync();

                            // Deserialise the data (include the Newtonsoft JSON Nuget package if you don't already have it)
                            var deserialized = JsonConvert.DeserializeObject<GoogleAuthorizationCode>(custome‌​rJsonString);
                            if (deserialized != null && !string.IsNullOrEmpty(deserialized.access_token))
                            {
                                result = deserialized;
                                result.refresh_token = refreshToken;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = new GoogleAuthorizationCode();
            }

            return result;
        }

        private async Task<TaskReminderDetailModel> CreateGoogleTask(User user, AddOrUpdateTaskReminderRequest task)
        {
            var result = new TaskReminderDetailModel();

            var accessTokenGoogle = await GetGoogleAccessToken(user);

            try
            {
                using (var client = new HttpClient())
                {
                    //set request
                    var request = new HttpRequestMessage(HttpMethod.Post, $"https://tasks.googleapis.com/tasks/v1/lists/" +
                        $"{task.GoogleTaskListId}/tasks?key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                    //set Header
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", accessTokenGoogle);

                    //content
                    var json = JsonConvert.SerializeObject(new
                    {
                        kind = "tasks#tasks",
                        title = task.Name,
                        notes = task.Description,
                        status = "needsAction",
                        due = task.DueDate,
                        deleted = false
                    });
                    request.Content = new StringContent(json);

                    //get response
                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        // Get the response
                        var customerJsonString = await response.Content.ReadAsStringAsync();

                        // Deserialise the data (include the Newtonsoft JSON Nuget package if you don't already have it)
                        var deserialized = JsonConvert.DeserializeObject<GoogleCalendarTaskItem>(custome‌​rJsonString);
                        if (deserialized != null && !string.IsNullOrEmpty(deserialized.id))
                        {
                            var timeNow = DateTime.Now;
                            result = new TaskReminderDetailModel
                            {
                                GoogleTaskListId = task.GoogleTaskListId,
                                Id = deserialized.id,
                                Created = deserialized.updated,
                                Deleted = false,
                                Description = deserialized.notes,
                                Done = deserialized.status == "completed",
                                DueDate = deserialized.due,
                                IsGoogleTask = true,
                                Name = deserialized.title,
                                NameDay = deserialized.status == "completed" ? TaskReminderStatus.Completed.ToString() :
                                deserialized.due.Date < timeNow ?
                                TaskReminderStatus.Overdue.ToString() :
                                    deserialized.due.Date == timeNow ?
                                    TaskReminderStatus.Today.ToString() :
                                    TaskReminderStatus.Upcoming.ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = new TaskReminderDetailModel();
            }

            return result;
        }

        private async Task<TaskReminderDetailModel> UpdateGoogleTask(User user, AddOrUpdateTaskReminderRequest task)
        {
            var result = new TaskReminderDetailModel();

            var accessTokenGoogle = await GetGoogleAccessToken(user);

            try
            {
                using (var client = new HttpClient())
                {
                    //set request
                    var request = new HttpRequestMessage(HttpMethod.Put, $"https://tasks.googleapis.com/tasks/v1/lists/" +
                        $"{task.GoogleTaskListId}/tasks/{task.Id}?key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                    //set Header
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", accessTokenGoogle);

                    //content

                    var json = JsonConvert.SerializeObject(new
                    {
                        id = task.Id,
                        title = task.Name,
                        notes = task.Description,
                        due = task.DueDate,
                        status = task.IsDone ? "completed" : "needsAction",
                    });
                    request.Content = new StringContent(json);


                    //get response
                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        // Get the response
                        var customerJsonString = await response.Content.ReadAsStringAsync();

                        // Deserialise the data (include the Newtonsoft JSON Nuget package if you don't already have it)
                        var deserialized = JsonConvert.DeserializeObject<GoogleCalendarTaskItem>(custome‌​rJsonString);
                        if (deserialized != null && !string.IsNullOrEmpty(deserialized.id))
                        {
                            var timeNow = DateTime.Now;
                            result = new TaskReminderDetailModel
                            {
                                GoogleTaskListId = task.GoogleTaskListId,
                                Id = deserialized.id,
                                Created = deserialized.updated,
                                Deleted = false,
                                Description = deserialized.notes,
                                Done = deserialized.status == "completed",
                                DueDate = deserialized.due,
                                IsGoogleTask = true,
                                Name = deserialized.title,
                                NameDay = deserialized.status == "completed" ? TaskReminderStatus.Completed.ToString() :
                                deserialized.due.Date < timeNow ?
                                TaskReminderStatus.Overdue.ToString() :
                                    deserialized.due.Date == timeNow ?
                                    TaskReminderStatus.Today.ToString() :
                                    TaskReminderStatus.Upcoming.ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = new TaskReminderDetailModel();
            }

            return result;
        }

        private async Task<TaskReminderDetailModel> GetGoogleTaskDetail(User user, string id, string taskList)
        {
            var result = new TaskReminderDetailModel();

            var accessTokenGoogle = await GetGoogleAccessToken(user);

            try
            {
                using (var client = new HttpClient())
                {
                    //set request
                    var request = new HttpRequestMessage(HttpMethod.Get, $"https://tasks.googleapis.com/tasks/v1/lists/" +
                        $"{taskList}/tasks/{id}?key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                    //set Header
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", accessTokenGoogle);
                    //get response
                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        // Get the response
                        var customerJsonString = await response.Content.ReadAsStringAsync();

                        // Deserialise the data (include the Newtonsoft JSON Nuget package if you don't already have it)
                        var deserialized = JsonConvert.DeserializeObject<GoogleCalendarTaskItem>(custome‌​rJsonString);
                        if (deserialized != null && !string.IsNullOrEmpty(deserialized.id))
                        {
                            var timeNow = DateTime.Now;
                            result = new TaskReminderDetailModel
                            {
                                GoogleTaskListId = taskList,
                                Id = deserialized.id,
                                Created = deserialized.updated,
                                Deleted = false,
                                Description = deserialized.notes,
                                Done = deserialized.status == "completed",
                                DueDate = deserialized.due,
                                IsGoogleTask = true,
                                Name = deserialized.title,
                                NameDay = deserialized.status == "completed" ? TaskReminderStatus.Completed.ToString() :
                                deserialized.due.Date < timeNow ?
                                TaskReminderStatus.Overdue.ToString() :
                                    deserialized.due.Date == timeNow ?
                                    TaskReminderStatus.Today.ToString() :
                                    TaskReminderStatus.Upcoming.ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = new TaskReminderDetailModel();
            }

            return result;
        }

        private async Task<bool> DeleteGoogleTask(User user, string id, string taskList)
        {
            var result = false;

            var accessTokenGoogle = await GetGoogleAccessToken(user);

            try
            {
                using (var client = new HttpClient())
                {
                    //set request
                    var request = new HttpRequestMessage(HttpMethod.Delete, $"https://tasks.googleapis.com/tasks/v1/lists/" +
                        $"{taskList}/tasks/{id}?key=AIzaSyCNGPlz9EvS0yU2BdT_3pLpTm58zDc0Vec");
                    //set Header
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", accessTokenGoogle);
                    //get response
                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                result = false;
            }

            return result;
        }

        private async Task<string> GetGoogleAccessToken(User user)
        {
            var accessTokenGoogle = user.AccessTokenGoogle;

            if (!string.IsNullOrEmpty(user.RefreshTokenGoogle) && user.ExpiresInGoogle <= DateTime.Now)
            {
                var newToken = await GoogleAccessTokenFromRefreshToken(user.RefreshTokenGoogle);
                if (newToken != null && !string.IsNullOrEmpty(newToken.access_token) && newToken.expires_in > 0)
                {
                    user.ExpiresInGoogle = DateTime.Now.AddSeconds(newToken.expires_in);
                    user.AccessTokenGoogle = newToken.access_token;
                    accessTokenGoogle = newToken.access_token;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                }
            }

            return accessTokenGoogle;
        }
    }
}
