using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopCategoryController : ControllerBase
    {
        private readonly TopCategoriesService _topCategoriesService;
        public TopCategoryController(TopCategoriesService topCategoriesService)
        {
            _topCategoriesService = topCategoriesService;
        }

        [HttpGet]
        public IActionResult GetTopCategories()
        {
            var topCategories = _topCategoriesService.GetTopCategories();
            return Ok(topCategories);
        }
        [HttpGet("{id}")]
        public IActionResult GetTopCategoryById(int id)
        {
            var topCategory = _topCategoriesService.GetTopCategoryById(id);
            return Ok(topCategory);
        }
        [HttpPost]
        public IActionResult AddTopCategory([FromBody] TopCategoryDto topCategory)
        {
            _topCategoriesService.AddTopCategory(topCategory);
            return Ok();
        }
        [HttpPut]
        public IActionResult UpdateTopCategory([FromBody] TopCategoryDto topCategory)
        {
            _topCategoriesService.UpdateTopCategory(topCategory);
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteTopCategory(int id)
        {
            _topCategoriesService.DeleteTopCategory(id);
            return Ok();
        }
    }
}
