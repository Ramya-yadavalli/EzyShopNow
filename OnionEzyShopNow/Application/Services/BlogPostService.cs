
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class BlogPostService
    {
        private readonly IBlogPost _blogPostRepository;

        public BlogPostService(IBlogPost blogPostRepository)
        {
            _blogPostRepository = blogPostRepository;
        }

        public List<BlogPostDto> GetBlogPosts()
        {
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
        }

        public BlogPostDto? GetBlogPostById(int id)
        {
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
        }

        public BlogPostDto AddBlogPost(BlogPostDto blogPost)
        {
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

            return blogPost;
        }

        public bool UpdateBlogPost(BlogPostDto blogPost)
        {
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

            return true;
        }

        public bool DeleteBlogPost(int id)
        {
            if (_blogPostRepository.GetBlogPostById(id) == null)
                return false;

            _blogPostRepository.DeleteBlogPost(id);
            return true;
        }
    }
}
