using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Logging;
namespace Application.Services
{

    public class HeroBannerService
    {
        private readonly IHeroBanner _heroBanner;

        private readonly ILogger<HeroBannerService> _logger;

        public HeroBannerService(IHeroBanner heroBanner, ILogger<HeroBannerService> logger)
        {
            _heroBanner = heroBanner;
            _logger = logger;
        }

        public List<HeroBannerDto> GetHeroBanners()
        {
            try
            {
                _logger.LogInformation("Retrieving all hero banners.");
                _logger.LogDebug("Calling GetHeroBanners method from the repository.");
                return _heroBanner.GetHeroBanners().Select(h => new HeroBannerDto
                {
                    Id = h.Id,
                    Title = h.Title,
                    Header = h.Header,
                    Description = h.Description,
                    ImagePath = h.ImagePath
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving hero banners.");
                throw new ApplicationException("An error occurred while retrieving hero banners.", ex);
            }
        }

        public HeroBannerDto GetHeroBannerById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving hero banner with ID: {Id}", id);
                var heroBanner = _heroBanner.GetHeroBannerById(id);
                if (heroBanner == null)
                    return null;
                _logger.LogDebug("Successfully retrieved hero banner with ID: {Id}", id);
                return new HeroBannerDto
                {
                    Id = heroBanner.Id,
                    Title = heroBanner.Title,
                    Header = heroBanner.Header,
                    Description = heroBanner.Description,
                    ImagePath = heroBanner.ImagePath
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving hero banner with ID: {Id}", id);
                throw new ApplicationException("An error occurred while retrieving the hero banner.", ex);
            }
        }

        public void AddHeroBanner(HeroBannerDto heroBannerDto)
        {

            try
            {
                _logger.LogInformation("Adding a new hero banner with title: {Title}", heroBannerDto.Title);
                var heroBanner = new Domain.Entities.HeroBanner
                {
                    Title = heroBannerDto.Title,
                    Header = heroBannerDto.Header,
                    Description = heroBannerDto.Description,
                    ImagePath = heroBannerDto.ImagePath
                };
                _heroBanner.AddHeroBanner(heroBanner);
                _logger.LogDebug("Successfully added a new hero banner with title: {Title}", heroBannerDto.Title);
            }
            catch (Exception ex)
            {
                // Handle the exception (e.g., log it, rethrow it, etc.)
                _logger.LogError("An error occurred while adding a new hero banner with title: {Title}. Exception: {Exception}", heroBannerDto.Title, ex);
                throw new ApplicationException("An error occurred while adding the hero banner.", ex);
            }



        }

        public void UpdateHeroBanner(HeroBannerDto heroBannerDto)
        {
            try
            {
                _logger.LogInformation("Updating hero banner with ID: {Id}", heroBannerDto.Id);
                var heroBanner = new Domain.Entities.HeroBanner
                {
                    Id = heroBannerDto.Id,
                    Title = heroBannerDto.Title,
                    Header = heroBannerDto.Header,
                    Description = heroBannerDto.Description,
                    ImagePath = heroBannerDto.ImagePath
                };
                _heroBanner.UpdateHeroBanner(heroBanner);
                _logger.LogDebug("Successfully updated hero banner with ID: {Id}", heroBannerDto.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating hero banner with ID: {Id}", heroBannerDto.Id);
                // Handle the exception (e.g., log it, rethrow it, etc.)
                throw new ApplicationException("An error occurred while updating the hero banner.", ex);
            }
        }

        public void DeleteHeroBanner(int id)
        {
            _logger.LogInformation("Deleting hero banner with ID: {Id}", id);
            try
            {
                _heroBanner.DeleteHeroBanner(id);
                _logger.LogDebug("Successfully deleted hero banner with ID: {Id}", id);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting hero banner with ID: {Id}", id);
                // Handle the exception (e.g., log it, rethrow it, etc.)
                throw new ApplicationException("An error occurred while deleting the hero banner.", ex);
            }
        }
    }
}