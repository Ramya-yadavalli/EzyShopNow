using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface IUserRole
    {
        List<UserRole> GetUserRoles();
        UserRole GetUserRoleById(int id);
        void AddUserRole(UserRole userRole);
        void UpdateUserRole(UserRole userRole);
        void DeleteUserRole(int id);
    }
}
