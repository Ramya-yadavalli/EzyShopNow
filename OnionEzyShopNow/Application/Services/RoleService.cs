
using Application.DTOs;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class RoleService
    {
        private readonly IRole _role;
        private readonly ILogger<RoleService> _logger;

        public RoleService(IRole role, ILogger<RoleService> logger)
        {
            _role = role;
            _logger = logger;
        }

        public List<RoleDto> GetRoles()
        {
            try
            {
                _logger.LogInformation("Retrieving all roles.");

                var roles = _role.GetRoles()
                    .Select(r => new RoleDto
                    {
                        Id = r.Id,
                        RoleName = r.RoleName
                    })
                    .ToList();

                _logger.LogDebug("Successfully retrieved all roles.");

                return roles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving roles.");
                throw;
            }
        }

        public RoleDto? GetRoleById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving role with ID: {Id}", id);

                var role = _role.GetRoleById(id);

                if (role == null)
                {
                    _logger.LogWarning("Role with ID: {Id} was not found.", id);
                    return null;
                }

                var roleDto = new RoleDto
                {
                    Id = role.Id,
                    RoleName = role.RoleName
                };

                _logger.LogDebug("Successfully retrieved role with ID: {Id}", id);

                return roleDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving role with ID: {Id}", id);
                throw;
            }
        }

        public bool AddRole(RoleDto role)
        {
            try
            {
                _logger.LogInformation("Adding a new role with name: {RoleName}", role.RoleName);

                var newRole = new Domain.Entities.Role
                {
                    RoleName = role.RoleName
                };

                _role.AddRole(newRole);

                _logger.LogDebug("Successfully added role with name: {RoleName}", role.RoleName);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding role: {RoleName}", role.RoleName);
                throw new ApplicationException("An error occurred while adding the role.", ex);
            }
        }

        public bool UpdateRole(RoleDto role)
        {
            try
            {
                _logger.LogInformation("Updating role with ID: {Id}", role.Id);

                var updatedRole = new Domain.Entities.Role
                {
                    Id = role.Id,
                    RoleName = role.RoleName
                };

                _role.UpdateRole(updatedRole);

                _logger.LogDebug("Successfully updated role with ID: {Id}", role.Id);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating role with ID: {Id}", role.Id);
                throw new ApplicationException("An error occurred while updating the role.", ex);
            }
        }

        public bool DeleteRole(int id)
        {
            try
            {
                _logger.LogInformation("Deleting role with ID: {Id}", id);

                var role = _role.GetRoleById(id);

                if (role == null)
                {
                    _logger.LogWarning("Role with ID: {Id} was not found. Delete cancelled.", id);
                    return false;
                }

                _role.DeleteRole(role.Id);

                _logger.LogDebug("Successfully deleted role with ID: {Id}", id);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting role with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the role.", ex);
            }
        }
    }
}
