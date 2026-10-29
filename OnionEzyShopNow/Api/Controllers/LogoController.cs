using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogoController : ControllerBase
    {
        private readonly LogoService _logoService;
        public LogoController(LogoService logoService)
        {
            _logoService = logoService;
        }

        [HttpGet]
        public IActionResult GetLogos()
        {
            var logos = _logoService.GetLogos();
            return Ok(logos);
        }

        [HttpGet("{id}")]
        public IActionResult GetLogoById(int id)
        {
            var logo = _logoService.GetLogoById(id);
            if (logo == null) return NotFound();
            return Ok(logo);
        }
        [HttpPost]
        public IActionResult CreateLogo([FromBody] LogoDto logoDto)
        {
            _logoService.CreateLogo(logoDto);
            return Ok();
        }
        [HttpPut]
        public IActionResult UpdateLogo([FromBody] LogoDto logoDto)
        {
            _logoService.UpdateLogo(logoDto);
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteLogo(int id)
        {
            _logoService.DeleteLogo(id);
            return Ok();
        }
    }
}
