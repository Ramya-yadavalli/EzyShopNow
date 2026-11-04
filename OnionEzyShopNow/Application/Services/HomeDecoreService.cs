
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class HomeDecoreService
    {
        private readonly IHomeDecore _homeDecore;
        private readonly ILogger<HomeDecoreService> _logger;

        public HomeDecoreService(
            IHomeDecore homeDecore,
            ILogger<HomeDecoreService> logger)
        {
            _homeDecore = homeDecore;
            _logger = logger;
        }

        public List<HomeDecoreDto> GetHomeDecores()
        {
            try
            {
                _logger.LogInformation("Retrieving all home decors.");

                var homeDecores = _homeDecore.GetHomeDecores()
                    .Select(h => new HomeDecoreDto
                    {
                        Id = h.Id,
                        Name = h.Name,
                        ImagePath = h.ImagePath
                    })
                    .ToList();

                _logger.LogDebug("Successfully retrieved all home decors.");

                return homeDecores;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving home decors.");
                throw;
            }
        }

        public HomeDecoreDto? GetHomeDecoreById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving home decor with ID: {Id}", id);

                var homeDecore = _homeDecore.GetHomeDecoreById(id);

                if (homeDecore == null)
                {
                    _logger.LogWarning("Home decor with ID: {Id} was not found.", id);
                    return null;
                }

                var homeDecoreDto = new HomeDecoreDto
                {
                    Id = homeDecore.Id,
                    Name = homeDecore.Name,
                    ImagePath = homeDecore.ImagePath
                };

                _logger.LogDebug("Successfully retrieved home decor with ID: {Id}", id);

                return homeDecoreDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving home decor with ID: {Id}", id);
                throw;
            }
        }

        public void AddHomeDecore(HomeDecoreDto homeDecore)
        {
            try
            {
                _logger.LogInformation("Adding a new home decor with name: {Name}", homeDecore.Name);

                var newHomeDecore = new Domain.Entities.HomeDecore
                {
                    Name = homeDecore.Name,
                    ImagePath = homeDecore.ImagePath
                };

                _homeDecore.AddHomeDecore(newHomeDecore);

                _logger.LogDebug("Successfully added a new home decor with name: {Name}", homeDecore.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding home decor with name: {Name}", homeDecore.Name);
                throw new ApplicationException("An error occurred while adding home decor.", ex);
            }
        }

        public void UpdateHomeDecore(HomeDecoreDto homeDecore)
        {
            try
            {
                _logger.LogInformation("Updating home decor with ID: {Id}", homeDecore.Id);

                var updatedHomeDecore = new Domain.Entities.HomeDecore
                {
                    Id = homeDecore.Id,
                    Name = homeDecore.Name,
                    ImagePath = homeDecore.ImagePath
                };

                _homeDecore.UpdateHomeDecore(updatedHomeDecore);

                _logger.LogDebug("Successfully updated home decor with ID: {Id}", homeDecore.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating home decor with ID: {Id}", homeDecore.Id);
                throw new ApplicationException("An error occurred while updating home decor.", ex);
            }
        }

        public void DeleteHomeDecore(int id)
        {
            try
            {
                _logger.LogInformation("Deleting home decor with ID: {Id}", id);

                _homeDecore.DeleteHomeDecore(id);

                _logger.LogDebug("Successfully deleted home decor with ID: {Id}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting home decor with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting home decor.", ex);
            }
        }
    }
}
