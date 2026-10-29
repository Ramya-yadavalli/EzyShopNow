using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class RoleService
    {
        private readonly IRole _role;
        public RoleService(IRole role)
        {
            _role = role;
        }

        public List<RoleDto> GetRoles() => _role.GetRoles().Select(r => new RoleDto
        {
            Id = r.Id,
            RoleName = r.RoleName
        }).ToList();

        public RoleDto GetRoleById(int id)
        {
            var role = _role.GetRoleById(id);
            return new RoleDto
            {
                Id = role.Id,
                RoleName = role.RoleName
            };
        }
        public bool AddRole(RoleDto role)
        {
            var newRole = new Domain.Entities.Role
            {
                RoleName = role.RoleName
            };
            _role.AddRole(newRole);
            return true;
        }
        public bool UpdateRole(RoleDto role)
        {
            var updatedRole = new Domain.Entities.Role
            {
                Id = role.Id,
                RoleName = role.RoleName
            };
            _role.UpdateRole(updatedRole);
            return true;
        }
        public bool DeleteRole(int id)
        {
            var role = _role.GetRoleById(id);
            _role.DeleteRole(role.Id);
            return true;
        }
    }
}
