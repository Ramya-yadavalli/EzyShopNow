using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class HomeDecoreRepository : IHomeDecore
    {
        private readonly AppDbContext _context;
        public HomeDecoreRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<HomeDecore> GetHomeDecores()
        {
            return _context.HomeDecores.ToList();
        }
        public HomeDecore GetHomeDecoreById(int id)
        {
            
            return _context.HomeDecores.Find(id);
        }
        public void AddHomeDecore(HomeDecore homeDecore)
        {
            _context.HomeDecores.Add(homeDecore);
            _context.SaveChanges();
        }
        public void UpdateHomeDecore(HomeDecore homeDecore)
        {
            _context.HomeDecores.Update(homeDecore);
            _context.SaveChanges();
        }
        public void DeleteHomeDecore(int id)
        {
            _context.HomeDecores.Remove(_context.HomeDecores.Find(id));
            _context.SaveChanges();
        }
    }
}
