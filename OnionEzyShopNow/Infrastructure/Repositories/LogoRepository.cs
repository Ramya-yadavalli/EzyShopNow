using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class LogoRepository : ILogo
    {
        private readonly AppDbContext _context;
        public LogoRepository(AppDbContext context)
        {
            _context = context;
        }
        public List<Logo> GetLogos()
        {
            return _context.Logos.ToList();
        }
        public Logo GetLogoById(int id)
        {
            return _context.Logos.Find(id);
        }
        public void CreateLogo(Domain.Entities.Logo logo)
        {
            _context.Logos.Add(logo);
            _context.SaveChanges();
        }
        public void UpdateLogo(Domain.Entities.Logo logo)
        {
            _context.Logos.Update(logo);
            _context.SaveChanges();
        }
        public void DeleteLogo(int id)
        {
            var logo = _context.Logos.Find(id);
            if (logo != null)
            {
                _context.Logos.Remove(logo);
                _context.SaveChanges();
            }
        }
    }
}
