
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class BlogPostService
    {
        private readonly IBlogPost _blogPostRepository;

        private readonly ILogger<BlogPostService> _logger;

        public BlogPostService(IBlogPost blogPostRepository, ILogger<BlogPostService> logger)
        {
            _blogPostRepository = blogPostRepository;
            _logger = logger;
        }

        public List<BlogPostDto> GetBlogPosts()
        {
            try
            {
                _logger.LogWarning("Retrieving all blog posts.");
                return _blogPostRepository.GetBlogPosts()
                .Select(blogPost => new BlogPostDto
                {
                    Id = blogPost.Id,
                    Title = blogPost.Title,
                    Date = blogPost.Date,
                    Category = blogPost.Category,
                    Description = blogPost.Description,
                    Slug = blogPost.Slug,
                    ImagePath = blogPost.ImagePath
                })
                .ToList();
                _logger.LogDebug("Successfully retrieved all blog posts.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving blog posts.");
                throw;
            }
        }

        public BlogPostDto? GetBlogPostById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving blog post with ID: {Id}", id);
                var blogPost = _blogPostRepository.GetBlogPostById(id);

                if (blogPost == null)
                    return null;

                return new BlogPostDto
                {
                    Id = blogPost.Id,
                    Title = blogPost.Title,
                    Date = blogPost.Date,
                    Category = blogPost.Category,
                    Description = blogPost.Description,
                    Slug = blogPost.Slug,
                    ImagePath = blogPost.ImagePath
                };
                _logger.LogDebug("Successfully retrieved blog post with ID: {Id}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the blog post with ID: {Id}", id);
                throw;
            }
        }

        public BlogPostDto AddBlogPost(BlogPostDto blogPost)
        {
            try
            {   _logger.LogInformation("Adding a new blog post with title: {Title}", blogPost.Title);
                var newBlogPost = new BlogPost
                {
                    Title = blogPost.Title,
                    Date = blogPost.Date,
                    Category = blogPost.Category,
                    Description = blogPost.Description,
                    Slug = blogPost.Slug,
                    ImagePath = blogPost.ImagePath
                };

                _blogPostRepository.AddBlogPost(newBlogPost);

                // EF Core populates the generated ID after SaveChanges().
                blogPost.Id = newBlogPost.Id;
                _logger.LogDebug("Successfully added a new blog post with ID: {Id}", blogPost.Id);
                return blogPost;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new blog post with title: {Title}", blogPost.Title);
                throw new ApplicationException("An error occurred while adding the blog post.", ex);
            }
        }

        public bool UpdateBlogPost(BlogPostDto blogPost)
        {
            try
            {
                _logger.LogInformation("Updating blog post with ID: {Id}", blogPost.Id);
                var existingPost =
               _blogPostRepository.GetBlogPostById(blogPost.Id);

                if (existingPost == null)
                    return false;

                existingPost.Title = blogPost.Title;
                existingPost.Date = blogPost.Date;
                existingPost.Category = blogPost.Category;
                existingPost.Description = blogPost.Description;
                existingPost.Slug = blogPost.Slug;
                existingPost.ImagePath = blogPost.ImagePath;

                _blogPostRepository.UpdateBlogPost(existingPost);
                _logger.LogDebug("Successfully updated blog post with ID: {Id}", blogPost.Id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the blog post with ID: {Id}", blogPost.Id);
                throw new ApplicationException("An error occurred while updating the blog post.", ex);
            }
        }

        public bool DeleteBlogPost(int id)
        {
            try
            {
                _logger.LogInformation("Deleting blog post with ID: {Id}", id);
                if (_blogPostRepository.GetBlogPostById(id) == null)
                    return false;

                _blogPostRepository.DeleteBlogPost(id);
                _logger.LogDebug("Successfully deleted blog post with ID: {Id}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the blog post with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the blog post.", ex);
            }
        }
    }
}
