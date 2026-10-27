using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly BlogPostService _blogPostService;
        
        public BlogPostController(BlogPostService blogPostService)
        {
            _blogPostService = blogPostService;
        }
        [HttpGet]
        public IActionResult GetBlogPosts()
        {
            var blogPosts = _blogPostService.GetBlogPosts();
            return Ok(blogPosts);
        }
        [HttpGet("{id}")]
        public IActionResult GetBlogPostById(int id)
        {
            var blogPost = _blogPostService.GetBlogPostById(id);
            if (blogPost == null)
            {
                return NotFound();
            }
            return Ok(blogPost);
        }
        [HttpPost]
        public IActionResult AddBlogPost([FromBody] BlogPostDto blogPost)
        {
            var createdBlogPost = _blogPostService.AddBlogPost(blogPost);
            return CreatedAtAction(nameof(GetBlogPostById), new { id = createdBlogPost.Id }, createdBlogPost);
        }
        [HttpPut("{id}")]
        public IActionResult UpdateBlogPost(int id, [FromBody] BlogPostDto blogPost)
        {
            if (id != blogPost.Id)
            {
                return BadRequest();
            }
            _blogPostService.UpdateBlogPost(blogPost);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteBlogPost(int id)
        {
            _blogPostService.DeleteBlogPost(id);
            return NoContent();
        }
    }
}
