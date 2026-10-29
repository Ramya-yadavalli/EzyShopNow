using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;
        public RoleController(RoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public IActionResult GetRoles()
        {
            return Ok(_roleService.GetRoles());
        }
        [HttpGet("{id}")]
        public IActionResult GetRole(int id)
        {
            var role = _roleService.GetRoleById(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }
        [HttpPost]
        public IActionResult CreateRole([FromBody] RoleDto roleDto)
        {
            _roleService.AddRole(roleDto);
            return CreatedAtAction(nameof(GetRole), new { id = roleDto.Id }, roleDto);
        }
        [HttpPut]
        public IActionResult UpdateRole([FromBody] RoleDto roleDto)
        {
            _roleService.UpdateRole(roleDto);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteRole(int id)
        {
            _roleService.DeleteRole(id);
            return NoContent();
        }
    }
}
