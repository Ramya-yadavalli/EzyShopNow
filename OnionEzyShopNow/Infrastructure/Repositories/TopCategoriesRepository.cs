using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class TopCategoriesRepository : ITopCategories
    {
        public readonly AppDbContext _context;
        public TopCategoriesRepository(AppDbContext context)
        {
            _context = context;
        }
        public bool AddTopCategory(TopCategories topCategory)
        {
            _context.TopCategories.Add(topCategory);
            _context.SaveChanges();
            return true; 
        }

        public bool DeleteTopCategory(int id)
        {
            _context.TopCategories.Remove(_context.TopCategories.Find(id));
            _context.SaveChanges();
            return true;
        }

        public List<TopCategories> GetTopCategories()
        {
            return _context.TopCategories.ToList();
        }

        public TopCategories GetTopCategoryById(int id)
        {
            return _context.TopCategories.Find(id);
        }

        public bool UpdateTopCategory(TopCategories topCategories)
        {
            _context.TopCategories.Update(topCategories);
            _context.SaveChanges();
            return true;
        }
    }
}
