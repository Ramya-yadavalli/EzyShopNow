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
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<HomeDecore> HomeDecores { get; set; }
        public DbSet<HeroBanner> HeroBanners { get; set; }
        public DbSet<Logo> Logos { get; set; }
    }
}
