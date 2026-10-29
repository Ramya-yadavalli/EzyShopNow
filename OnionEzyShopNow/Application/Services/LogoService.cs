using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class LogoService
    {
        private readonly ILogo _logo;

        public LogoService(ILogo logo)
        {
            _logo = logo;
        }

        public List<LogoDto> GetLogos() => _logo.GetLogos().Select(l => new LogoDto
        {
            Id = l.Id,
            ImagePath = l.ImagePath,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt
        }).ToList();

        public LogoDto GetLogoById(int id)
        {
            var logo = _logo.GetLogoById(id);
            if (logo == null) return null;
            return new LogoDto
            {
                Id = logo.Id,
                ImagePath = logo.ImagePath,
                CreatedAt = logo.CreatedAt,
                UpdatedAt = logo.UpdatedAt
            };
        }
        public void CreateLogo(LogoDto logoDto)
        {
            var logo = new Domain.Entities.Logo
            {
                ImagePath = logoDto.ImagePath,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            _logo.CreateLogo(logo);
        }
        public void UpdateLogo(LogoDto logoDto)
        {
            var logo = _logo.GetLogoById(logoDto.Id);
            if (logo == null) return;
            logo.ImagePath = logoDto.ImagePath;
            logo.UpdatedAt = DateTime.Now;
            _logo.UpdateLogo(logo);
        }
        public void DeleteLogo(int id)
        {
            _logo.DeleteLogo(id);
        }
    }
}
