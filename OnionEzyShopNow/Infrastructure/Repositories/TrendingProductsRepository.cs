using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class TrendingProductsRepository : ITrendingProducts
    {
        private readonly AppDbContext _context;
        public TrendingProductsRepository(AppDbContext context)
        {
            _context = context;
        }
        public List<TrendingProducts> GetTrendingProducts()
        {
            return _context.TrendingProducts.ToList();
        }
        public TrendingProducts GetTrendingProductById(int id)
        {
            return _context.TrendingProducts.Find(id);
        }
        public bool AddTrendingProduct(TrendingProducts trendingProduct)
        {
            _context.TrendingProducts.Add(trendingProduct);
            _context.SaveChanges();
            return true;
        }
        public bool UpdateTrendingProduct(TrendingProducts trendingProduct)
        {
            _context.TrendingProducts.Update(trendingProduct);
            _context.SaveChanges();
            return true;
        }
        public bool DeleteTrendingProduct(int id)
        {
            _context.TrendingProducts.Remove(_context.TrendingProducts.Find(id));
            _context.SaveChanges();
            return true;
        }
    }
}
