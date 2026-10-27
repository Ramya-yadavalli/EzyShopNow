using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface IBlogPost
    {
        List<BlogPost> GetBlogPosts();
        BlogPost GetBlogPostById(int id);
        void AddBlogPost(BlogPost blogPost);
        void UpdateBlogPost(BlogPost blogPost);
        void DeleteBlogPost(int id);

    }
}
