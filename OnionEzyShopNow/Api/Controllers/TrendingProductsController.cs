using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrendingProductsController : ControllerBase
    {
        private readonly TrendingProductsService _trendingProductsService;
        public TrendingProductsController(TrendingProductsService trendingProductsService)
        {
            _trendingProductsService = trendingProductsService;
        }
        [HttpGet]
        public IActionResult GetTrendingProducts()
        {
            var trendingProducts = _trendingProductsService.GetTrendingProducts();
            return Ok(trendingProducts);
        }
        [HttpGet("{id}")]
        public IActionResult GetTrendingProductById(int id)
        {
            var trendingProduct = _trendingProductsService.GetTrendingProductById(id);
            return Ok(trendingProduct);
        }
        [HttpPost]
        public IActionResult AddTrendingProduct([FromBody] TrendingProductsDto trendingProduct)
        {
            _trendingProductsService.AddTrendingProduct(trendingProduct);
            return Ok();
        }
        [HttpPut]
        public IActionResult UpdateTrendingProduct([FromBody] TrendingProductsDto trendingProduct)
        {
            _trendingProductsService.UpdateTrendingProduct(trendingProduct);
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteTrendingProduct(int id)
        {
            _trendingProductsService.DeleteTrendingProduct(id);
            return Ok();
        }
    }
}
