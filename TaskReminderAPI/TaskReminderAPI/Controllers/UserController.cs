using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
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
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == model.Email && !x.Deleted);
            if (user is null)
                return BadRequest("Email is incorrect");

            var hashedPassword = new PasswordHasher<object?>().HashPassword(null, model.Password);

            var passwordVerificationResult = new PasswordHasher<object?>().VerifyHashedPassword(null, user.Password, model.Password);
            switch (passwordVerificationResult)
            {
                case PasswordVerificationResult.Failed:
                    return BadRequest("Password incorrect.");

                case PasswordVerificationResult.Success:
                    //return Ok(user, "123456789");
                    return Ok(new AuthenticateResponse(user, $"{DateTime.Now:ddMMyyyy}12345"));

                case PasswordVerificationResult.SuccessRehashNeeded:
                    return BadRequest("Password ok but should be rehashed and updated.");
            }

            return Ok();
        }

        [HttpPost("authorize/google")]
        public async Task<IActionResult> AuthenticateWithGoogle([FromBody] AuthenticateWithGoogleRequest model)
        {

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == model.Email && !x.Deleted);
            if (user is null)
            {
                var googleAuthorization = await GoogleAuthorizationCode(model.AccessToken);

                user = new User
                {
                    ExpiresInGoogle = googleAuthorization != null ? DateTime.Now.AddSeconds(googleAuthorization.expires_in) : DateTime.Now,
                    RefreshTokenGoogle = googleAuthorization != null ? googleAuthorization.refresh_token : "",
                    AccessTokenGoogle = googleAuthorization != null ? googleAuthorization.access_token : "",
                    Created = DateTime.Now,
                    Deleted = false,
                    Email = model.Email,
                    FullName = model.Fullname,
                    Password = new PasswordHasher<object?>().HashPassword(null, "abc@123"),
                    PhotoUrl = model.PhotoUrl,
                };
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                //user.AccessTokenGoogle = model.AccessToken;
                if (string.IsNullOrEmpty(user.RefreshTokenGoogle))
                {
                    var googleAuthorization = await GoogleAuthorizationCode(model.AccessToken);
                    if (googleAuthorization != null)
                    {
                        user.ExpiresInGoogle = googleAuthorization.expires_in > 0 ? DateTime.Now.AddSeconds(googleAuthorization.expires_in) : DateTime.Now;
                        user.RefreshTokenGoogle = !string.IsNullOrEmpty(googleAuthorization.refresh_token) ? googleAuthorization.refresh_token : "";
                        user.AccessTokenGoogle = !string.IsNullOrEmpty(googleAuthorization.access_token) ? googleAuthorization.access_token : "";
                    }
                }

                if (!string.IsNullOrEmpty(user.RefreshTokenGoogle) && user.ExpiresInGoogle <= DateTime.Now)
                {
                    var newToken = await GoogleAccessTokenFromRefreshToken(user.RefreshTokenGoogle);
                    if (newToken != null)
                    {
                        user.ExpiresInGoogle = newToken.expires_in > 0 ? DateTime.Now.AddSeconds(newToken.expires_in) : DateTime.Now;
                        user.AccessTokenGoogle = !string.IsNullOrEmpty(newToken.access_token) ? newToken.access_token : "";
                    }
                }

                user.PhotoUrl = model.PhotoUrl;
                user.FullName = model.Fullname;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            return Ok(new AuthenticateResponse(user, $"{DateTime.Now:ddMMyyyy}12345"));
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePass([FromBody] ChangePassRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == model.Email && !x.Deleted);
            if (user is null)
                return BadRequest("Email is incorrect");

            if (model.NewPassword != model.ConfirmPassword)
                return BadRequest("New Password and Confirm Password not correct");

            var hashedPassword = new PasswordHasher<object?>().HashPassword(null, model.CurrentPassword);

            var passwordVerificationResult = new PasswordHasher<object?>().VerifyHashedPassword(null, user.Password, model.CurrentPassword);
            switch (passwordVerificationResult)
            {
                case PasswordVerificationResult.Failed:
                    return BadRequest("Password incorrect.");

                case PasswordVerificationResult.Success:
                    var hashedNewPassword = new PasswordHasher<object?>().HashPassword(null, model.NewPassword);
                    user.Password = hashedNewPassword;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok();

                case PasswordVerificationResult.SuccessRehashNeeded:
                    return BadRequest("Password ok but should be rehashed and updated.");
            }

            return Ok();
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

        [HttpGet("checkCallOAuthGoogle/{email}")]
        [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CheckExistUserEmailAndRefreshTokenGoogle(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(c => c.Email == email && !string.IsNullOrEmpty(c.RefreshTokenGoogle) && !c.Deleted);
            return user == null ? Ok(false) : Ok(true);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(User user)
        {
            user.Deleted = false;
            user.PhotoUrl = "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png";
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

        private async Task<GoogleAuthorizationCode> GoogleAuthorizationCode(string code)
        {
            var result = new GoogleAuthorizationCode();

            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var request = new HttpRequestMessage(new HttpMethod("POST"), $"https://oauth2.googleapis.com/token"))
                    {
                        var json = JsonConvert.SerializeObject(new
                        {
                            code = code,
                            client_id = "563919799549-l37pui6624jnr4j39n20aqvg83jvk54b.apps.googleusercontent.com",
                            client_secret = "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",
                            grant_type = "authorization_code",
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
    }
}
