using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<TopCategories> TopCategories { get; set; }
        public DbSet<TrendingProducts> TrendingProducts { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
    }
}
