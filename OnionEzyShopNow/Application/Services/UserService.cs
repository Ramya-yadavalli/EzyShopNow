using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class UserService
    {
        private readonly IUser _user;
        public UserService(IUser user)
        {
            _user = user;
        }
        public List<UserDto> GetUsers() => _user.GetUsers().Select(u => new UserDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Password = u.Password
        }).ToList();

        public UserDto GetUserById(int id)
        {
            var user = _user.GetUserById(id);
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password
            };
        }
        public bool AddUser(UserDto user)
        {
            var newUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                Password = user.Password
            };
            _user.AddUser(newUser);
            return true;
        }
        public bool UpdateUser(UserDto user)
        {
            var updatedUser = new User
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password
            };
            _user.UpdateUser(updatedUser);
            return true;
        }
        public bool DeleteUser(int id)
        {
            _user.DeleteUser(id);
            return true;
        }


    }
}
