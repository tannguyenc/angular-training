using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskReminderAPI.Migrations
{
    public partial class createduser_taskreminder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedUserId",
                table: "TaskReminders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskReminders_CreatedUserId",
                table: "TaskReminders",
                column: "CreatedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskReminders_Users_CreatedUserId",
                table: "TaskReminders",
                column: "CreatedUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskReminders_Users_CreatedUserId",
                table: "TaskReminders");

            migrationBuilder.DropIndex(
                name: "IX_TaskReminders_CreatedUserId",
                table: "TaskReminders");

            migrationBuilder.DropColumn(
                name: "CreatedUserId",
                table: "TaskReminders");
        }
    }
}
