using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TaskReminderAPI.Data;
using static TaskReminderAPI.Data.GlobalAppSetting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<APIOption>(builder.Configuration.GetSection("APISetting"));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TaskReminderDbContext>(
    o => o.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();
app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.EnsureDatabaseCreated();
app.Run();
