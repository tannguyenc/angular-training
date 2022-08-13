using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskReminderAPI.Migrations
{
    public partial class addTokenGoogleToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AccessToken",
                table: "Users",
                newName: "RefreshTokenGoogle");

            migrationBuilder.AddColumn<string>(
                name: "AccessTokenGoogle",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresInGoogle",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessTokenGoogle",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ExpiresInGoogle",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "RefreshTokenGoogle",
                table: "Users",
                newName: "AccessToken");
        }
    }
}
