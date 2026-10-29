using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{

    public class HeroBannerService
    {
        private readonly IHeroBanner _heroBanner;

        public HeroBannerService(IHeroBanner heroBanner)
        {
            _heroBanner = heroBanner;
        }

        public List<HeroBannerDto> GetHeroBanners() => _heroBanner.GetHeroBanners().Select(h => new HeroBannerDto
        {
            Id = h.Id,
            Title = h.Title,
            Header = h.Header,
            Description = h.Description,
            ImagePath = h.ImagePath
        }).ToList();

        public HeroBannerDto GetHeroBannerById(int id)
        {
            var heroBanner = _heroBanner.GetHeroBannerById(id);
            if (heroBanner == null)
                return null;
            return new HeroBannerDto
            {
                Id = heroBanner.Id,
                Title = heroBanner.Title,
                Header = heroBanner.Header,
                Description = heroBanner.Description,
                ImagePath = heroBanner.ImagePath
            };
        }

        public void AddHeroBanner(HeroBannerDto heroBannerDto)
        {
            var heroBanner = new Domain.Entities.HeroBanner
            {
                Title = heroBannerDto.Title,
                Header = heroBannerDto.Header,
                Description = heroBannerDto.Description,
                ImagePath = heroBannerDto.ImagePath
            };
            _heroBanner.AddHeroBanner(heroBanner);
        }

        public void UpdateHeroBanner(HeroBannerDto heroBannerDto)
        {
            var heroBanner = new Domain.Entities.HeroBanner
            {
                Id = heroBannerDto.Id,
                Title = heroBannerDto.Title,
                Header = heroBannerDto.Header,
                Description = heroBannerDto.Description,
                ImagePath = heroBannerDto.ImagePath
            };
            _heroBanner.UpdateHeroBanner(heroBanner);
        }

        public void DeleteHeroBanner(int id)
        {
            _heroBanner.DeleteHeroBanner(id);
        }
    }
}
