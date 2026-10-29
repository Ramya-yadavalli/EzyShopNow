using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeroBannerController : ControllerBase
    {
        private readonly HeroBannerService _heroBannerService;
        
        public HeroBannerController(HeroBannerService heroBannerService)
        {
            _heroBannerService = heroBannerService;
        }

        [HttpGet]
        public IActionResult GetHeroBanners()
        {
            var heroBanners = _heroBannerService.GetHeroBanners();
            return Ok(heroBanners);
        }
        [HttpGet("{id}")]
        public IActionResult GetHeroBannerById(int id)
        {
            var heroBanner = _heroBannerService.GetHeroBannerById(id);
            if (heroBanner == null)
            {
                return NotFound();
            }
            return Ok(heroBanner);
        }
        [HttpPost]
        public IActionResult AddHeroBanner(HeroBannerDto heroBannerDto)
        {
            _heroBannerService.AddHeroBanner(heroBannerDto);
            return Ok();
        }
        [HttpPut]
        public IActionResult UpdateHeroBanner(HeroBannerDto heroBannerDto)
        {
            _heroBannerService.UpdateHeroBanner(heroBannerDto);
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteHeroBanner(int id)
        {
            _heroBannerService.DeleteHeroBanner(id);
            return Ok();
        }
    }
}
