
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class UserService
    {
        private readonly IUser _user;
        private readonly ILogger<UserService> _logger;

        public UserService(IUser user, ILogger<UserService> logger)
        {
            _user = user;
            _logger = logger;
        }

        public List<UserDto> GetUsers()
        {
            try
            {
                _logger.LogInformation("Retrieving all users.");

                var users = _user.GetUsers()
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        Password = u.Password
                    })
                    .ToList();

                // Capture API response in logger
                _logger.LogInformation(
                    "Successfully retrieved users. Response: {@Users}",
                    users
                );

                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving users.");
                throw;
            }
        }
        public UserDto? GetUserById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving user with ID: {Id}", id);

                var user = _user.GetUserById(id);

                if (user == null)
                {
                    _logger.LogWarning("User with ID: {Id} was not found.", id);
                    return null;
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Password = user.Password
                };

                _logger.LogDebug("Successfully retrieved user with ID: {Id}", id);

                return userDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving user with ID: {Id}", id);
                throw;
            }
        }

        public bool AddUser(UserDto user)
        {
            try
            {
                _logger.LogInformation("Adding a new user with email: {Email}", user.Email);

                var newUser = new User
                {
                    Name = user.Name,
                    Email = user.Email,
                    Password = user.Password
                };

                _user.AddUser(newUser);

                _logger.LogDebug("Successfully added user with email: {Email}", user.Email);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding user with email: {Email}", user.Email);
                throw new ApplicationException("An error occurred while adding the user.", ex);
            }
        }

        public bool UpdateUser(UserDto user)
        {
            try
            {
                _logger.LogInformation("Updating user with ID: {Id}", user.Id);

                var updatedUser = new User
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Password = user.Password
                };

                _user.UpdateUser(updatedUser);

                _logger.LogDebug("Successfully updated user with ID: {Id}", user.Id);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user with ID: {Id}", user.Id);
                throw new ApplicationException("An error occurred while updating the user.", ex);
            }
        }

        public bool DeleteUser(int id)
        {
            try
            {
                _logger.LogInformation("Deleting user with ID: {Id}", id);

                _user.DeleteUser(id);

                _logger.LogDebug("Successfully deleted user with ID: {Id}", id);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting user with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the user.", ex);
            }
        }
    }
}
