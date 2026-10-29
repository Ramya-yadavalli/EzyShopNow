using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class UserRoleService
    {
        private readonly IUserRole _userRole;
        public UserRoleService(IUserRole userRole)
        {
            _userRole = userRole;
        }
        public List<UserRoleDto> GetUserRoles() => _userRole.GetUserRoles().Select(ur => new UserRoleDto
        {
            Id = ur.Id,
            UserId = ur.UserId,
            RoleId = ur.RoleId
        }).ToList();

        public UserRoleDto GetUserRoleById(int id)
        {
            var userRole = _userRole.GetUserRoleById(id);
            return new UserRoleDto
            {
                Id = userRole.Id,
                UserId = userRole.UserId,
                RoleId = userRole.RoleId
            };
        }
        public bool AddUserRole(UserRoleDto userRoleDto)
        {
            var newUserRole = new UserRole
            {
                UserId = userRoleDto.UserId,
                RoleId = userRoleDto.RoleId
            };
            _userRole.AddUserRole(newUserRole);
            return true;
        }
        public bool UpdateUserRole(UserRoleDto userRoleDto)
        {
            var updatedUserRole = new UserRole
            {
                Id = userRoleDto.Id,
                UserId = userRoleDto.UserId,
                RoleId = userRoleDto.RoleId
            };
            _userRole.UpdateUserRole(updatedUserRole);
            return true;
        }
        public bool DeleteUserRole(int id)
        {
            var userRole = _userRole.GetUserRoleById(id);
            _userRole.DeleteUserRole(userRole.Id);
            return true;
        }
    }
}
