using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class UserRoleRepository : IUserRole
    {
        private readonly AppDbContext _context;
        public UserRoleRepository(AppDbContext context)
        {
            _context = context;
        }
        public List<UserRole> GetUserRoles()
        {
            return _context.UserRoles.ToList();
        }
        public UserRole GetUserRoleById(int id)
        {
            return _context.UserRoles.Find(id);
        }
        public void AddUserRole(UserRole userRole)
        {
            _context.UserRoles.Add(userRole);
            _context.SaveChanges();
        }
        public void UpdateUserRole(UserRole userRole)
        {
            _context.UserRoles.Update(userRole);
            _context.SaveChanges();
        }
        public void DeleteUserRole(int id)
        {
            _context.UserRoles.Remove(_context.UserRoles.Find(id));
            _context.SaveChanges();
        }
    }
}
