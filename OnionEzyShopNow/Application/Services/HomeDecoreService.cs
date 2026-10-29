using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class HomeDecoreService
    {
        private readonly IHomeDecore _homeDecore;
        public HomeDecoreService(IHomeDecore homeDecore)
        {
            _homeDecore = homeDecore;
        }

        public List<HomeDecoreDto> GetHomeDecores() => _homeDecore.GetHomeDecores().Select(h => new HomeDecoreDto
        {
            Id = h.Id,
            Name = h.Name,
            ImagePath = h.ImagePath
        }).ToList();

        public HomeDecoreDto GetHomeDecoreById(int id)
        {
            var homeDecore = _homeDecore.GetHomeDecoreById(id);
            return new HomeDecoreDto
            {
                Id = homeDecore.Id,
                Name = homeDecore.Name,
                ImagePath = homeDecore.ImagePath
            };
        }

        public void AddHomeDecore(HomeDecoreDto homeDecore)
        {
            var newHomeDecore = new Domain.Entities.HomeDecore
            {
                Name = homeDecore.Name,
                ImagePath = homeDecore.ImagePath
            };
            _homeDecore.AddHomeDecore(newHomeDecore);
            
        }

        public void UpdateHomeDecore(HomeDecoreDto homeDecore)
        {
            var updatedHomeDecore = new Domain.Entities.HomeDecore
            {
                Id = homeDecore.Id,
                Name = homeDecore.Name,
                ImagePath = homeDecore.ImagePath
            };
            _homeDecore.UpdateHomeDecore(updatedHomeDecore);
        }

        public void DeleteHomeDecore(int id)
        {
            _homeDecore.DeleteHomeDecore(id);
        }

    }
}
