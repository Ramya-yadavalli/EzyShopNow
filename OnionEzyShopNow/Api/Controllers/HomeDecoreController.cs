using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeDecoreController : ControllerBase
    {
        private readonly HomeDecoreService _homeDecoreService;
        public HomeDecoreController(HomeDecoreService homeDecoreService)
        {
            _homeDecoreService = homeDecoreService;
        }

        [HttpGet]
        public IActionResult GetHomeDecores()
        {
            return Ok(_homeDecoreService.GetHomeDecores());
        }
        [HttpGet("{id}")]
        public IActionResult GetHomeDecore(int id)
        {
            var homeDecore = _homeDecoreService.GetHomeDecoreById(id);
            if (homeDecore == null)
            {
                return NotFound();
            }
            return Ok(homeDecore);
        }

        [HttpPost]
        public IActionResult CreateHomeDecore([FromBody] HomeDecoreDto homeDecoreDto)
        {
            _homeDecoreService.AddHomeDecore(homeDecoreDto);
            return CreatedAtAction(nameof(GetHomeDecore), new { id = homeDecoreDto.Id }, homeDecoreDto);
        }
        [HttpPut]
        public IActionResult UpdateHomeDecore([FromBody] HomeDecoreDto homeDecoreDto)
        {
            _homeDecoreService.UpdateHomeDecore(homeDecoreDto);
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteHomeDecore(int id)
        {
            _homeDecoreService.DeleteHomeDecore(id);
            return NoContent();
        }
    }
}
