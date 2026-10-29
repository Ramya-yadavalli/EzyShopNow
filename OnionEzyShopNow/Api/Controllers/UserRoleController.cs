using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly UserRoleService _userRoleService;
        public UserRoleController(UserRoleService userRoleService)
        {
            _userRoleService = userRoleService;
        }
        [HttpGet]
        public IActionResult GetUserRoles()
        {
            return Ok(_userRoleService.GetUserRoles());
        }
        [HttpGet("{id}")]
        public IActionResult GetUserRole(int id)
        {
            var userRole = _userRoleService.GetUserRoleById(id);
            if (userRole == null)
            {
                return NotFound();
            }
            return Ok(userRole);
        }
        [HttpPost]
        public IActionResult CreateUserRole([FromBody] UserRoleDto userRoleDto)
        {
            _userRoleService.AddUserRole(userRoleDto);
            return Ok();
        }
        [HttpPut]
        public IActionResult UpdateUserRole([FromBody] UserRoleDto userRoleDto)
        {
            _userRoleService.UpdateUserRole(userRoleDto);
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteUserRole(int id)
        {
            _userRoleService.DeleteUserRole(id);
            return Ok();
        }
    }
}
