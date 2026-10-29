using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface IHeroBanner
    {
        List<HeroBanner> GetHeroBanners();
        HeroBanner GetHeroBannerById(int id);
        void AddHeroBanner(HeroBanner heroBanner);
        void UpdateHeroBanner(HeroBanner heroBanner);
        void DeleteHeroBanner(int id);
    }
}
