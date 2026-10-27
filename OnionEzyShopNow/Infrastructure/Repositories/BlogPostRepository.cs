using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class BlogPostRepository : IBlogPost
    {
        private readonly AppDbContext _context;
        
        public BlogPostRepository(AppDbContext context)
        {
            _context = context;
        }
        public List<BlogPost> GetBlogPosts()
        {
            return _context.BlogPosts.ToList();
        }
        public BlogPost GetBlogPostById(int id)
        {
            return _context.BlogPosts.Find(id);
        }
        public void AddBlogPost(BlogPost blogPost)
        {
            _context.BlogPosts.Add(blogPost);
            _context.SaveChanges();
        }
        public void UpdateBlogPost(BlogPost blogPost)
        {
            _context.BlogPosts.Update(blogPost);
            _context.SaveChanges();
        }
        public void DeleteBlogPost(int id)
        {
            var blogPost = _context.BlogPosts.Find(id);
            if (blogPost != null)
            {
                _context.BlogPosts.Remove(blogPost);
                _context.SaveChanges();
            }
        }
    }
}
