using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class HeroBannerRepository : IHeroBanner
    {
        private readonly AppDbContext _context;

        public HeroBannerRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<HeroBanner> GetHeroBanners()
        {
            return _context.HeroBanners.ToList();
        }

        public HeroBanner GetHeroBannerById(int id)
        {
            return _context.HeroBanners.FirstOrDefault(h => h.Id == id);
        }
        public void AddHeroBanner(HeroBanner heroBanner)
        {
            _context.HeroBanners.Add(heroBanner);
            _context.SaveChanges();
        }
        public void UpdateHeroBanner(HeroBanner heroBanner)
        {
            _context.HeroBanners.Update(heroBanner);
            _context.SaveChanges();
        }
        public void DeleteHeroBanner(int id)
        {
            var heroBanner = _context.HeroBanners.FirstOrDefault(h => h.Id == id);
            if (heroBanner != null)
            {
                _context.HeroBanners.Remove(heroBanner);
                _context.SaveChanges();
            }
        }
    }
}
