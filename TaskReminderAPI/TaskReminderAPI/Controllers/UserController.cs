﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using TaskReminderAPI.Data;
using TaskReminderAPI.Models;

namespace TaskReminderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly TaskReminderDbContext _context;

        public UserController(
            TaskReminderDbContext context)
        {
            _context = context;
        }

        [HttpPost("authorize")]
        public async Task<AuthenticateResponse> Authenticate([FromBody] AuthenticateRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == model.Email && !x.Deleted);
            if (user is null)
                throw new DataException("Email is incorrect");

            var hashedPassword = new PasswordHasher<object?>().HashPassword(null, model.Password);

            var passwordVerificationResult = new PasswordHasher<object?>().VerifyHashedPassword(null, user.Password, model.Password);
            switch (passwordVerificationResult)
            {
                case PasswordVerificationResult.Failed:
                    throw new DataException("Password incorrect.");

                case PasswordVerificationResult.Success:
                    return new AuthenticateResponse(user, "123456789");

                case PasswordVerificationResult.SuccessRehashNeeded:
                    throw new DataException("Password ok but should be rehashed and updated.");
            }

            return new AuthenticateResponse(user, "123456789");
        }

        [HttpGet]
        public async Task<IEnumerable<User>> Get()
            => await _context.Users.Where(x => !x.Deleted).ToListAsync();

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id && !x.Deleted);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpGet("search/{email}")]
        [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByTitle(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(c => c.Email == email && !c.Deleted);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(User user)
        {
            user.Deleted = false;
            var hashedPassword = new PasswordHasher<object?>().HashPassword(null, user.Password);
            user.Password = hashedPassword;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, User user)
        {
            if (id != user.Id) return BadRequest();

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var userToDelete = await _context.Users.FindAsync(id);
            if (userToDelete == null) return NotFound();
            userToDelete.Deleted = true;
            _context.Users.Update(userToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
