
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class UserRoleService
    {
        private readonly IUserRole _userRole;
        private readonly ILogger<UserRoleService> _logger;

        public UserRoleService(
            IUserRole userRole,
            ILogger<UserRoleService> logger)
        {
            _userRole = userRole;
            _logger = logger;
        }

        public List<UserRoleDto> GetUserRoles()
        {
            try
            {
                _logger.LogInformation("Retrieving all user roles.");

                var userRoles = _userRole.GetUserRoles()
                    .Select(ur => new UserRoleDto
                    {
                        Id = ur.Id,
                        UserId = ur.UserId,
                        RoleId = ur.RoleId
                    })
                    .ToList();

                _logger.LogDebug("Successfully retrieved all user roles.");

                return userRoles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving user roles.");
                throw;
            }
        }

        public UserRoleDto? GetUserRoleById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving user role with ID: {Id}", id);

                var userRole = _userRole.GetUserRoleById(id);

                if (userRole == null)
                {
                    _logger.LogWarning("User role with ID: {Id} was not found.", id);
                    return null;
                }

                var userRoleDto = new UserRoleDto
                {
                    Id = userRole.Id,
                    UserId = userRole.UserId,
                    RoleId = userRole.RoleId
                };

                _logger.LogDebug("Successfully retrieved user role with ID: {Id}", id);

                return userRoleDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving user role with ID: {Id}", id);
                throw;
            }
        }

        public bool AddUserRole(UserRoleDto userRoleDto)
        {
            try
            {
                _logger.LogInformation(
                    "Adding a new user role for User ID: {UserId} and Role ID: {RoleId}",
                    userRoleDto.UserId,
                    userRoleDto.RoleId);

                var newUserRole = new UserRole
                {
                    UserId = userRoleDto.UserId,
                    RoleId = userRoleDto.RoleId
                };

                _userRole.AddUserRole(newUserRole);

                _logger.LogDebug(
                    "Successfully added user role for User ID: {UserId} and Role ID: {RoleId}",
                    userRoleDto.UserId,
                    userRoleDto.RoleId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while adding user role for User ID: {UserId}",
                    userRoleDto.UserId);

                throw new ApplicationException("An error occurred while adding the user role.", ex);
            }
        }

        public bool UpdateUserRole(UserRoleDto userRoleDto)
        {
            try
            {
                _logger.LogInformation("Updating user role with ID: {Id}", userRoleDto.Id);

                var updatedUserRole = new UserRole
                {
                    Id = userRoleDto.Id,
                    UserId = userRoleDto.UserId,
                    RoleId = userRoleDto.RoleId
                };

                _userRole.UpdateUserRole(updatedUserRole);

                _logger.LogDebug("Successfully updated user role with ID: {Id}", userRoleDto.Id);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while updating user role with ID: {Id}",
                    userRoleDto.Id);

                throw new ApplicationException("An error occurred while updating the user role.", ex);
            }
        }

        public bool DeleteUserRole(int id)
        {
            try
            {
                _logger.LogInformation("Deleting user role with ID: {Id}", id);

                var userRole = _userRole.GetUserRoleById(id);

                if (userRole == null)
                {
                    _logger.LogWarning("User role with ID: {Id} was not found. Delete cancelled.", id);
                    return false;
                }

                _userRole.DeleteUserRole(userRole.Id);

                _logger.LogDebug("Successfully deleted user role with ID: {Id}", id);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting user role with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the user role.", ex);
            }
        }
    }
}
