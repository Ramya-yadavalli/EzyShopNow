
using Application.DTOs;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class LogoService
    {
        private readonly ILogo _logo;
        private readonly ILogger<LogoService> _logger;

        public LogoService(ILogo logo, ILogger<LogoService> logger)
        {
            _logo = logo;
            _logger = logger;
        }

        public List<LogoDto> GetLogos()
        {
            try
            {
                _logger.LogInformation("Retrieving all logos.");

                var logos = _logo.GetLogos()
                    .Select(l => new LogoDto
                    {
                        Id = l.Id,
                        ImagePath = l.ImagePath,
                        CreatedAt = l.CreatedAt,
                        UpdatedAt = l.UpdatedAt
                    })
                    .ToList();

                _logger.LogDebug("Successfully retrieved all logos.");

                return logos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving logos.");
                throw;
            }
        }

        public LogoDto? GetLogoById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving logo with ID: {Id}", id);

                var logo = _logo.GetLogoById(id);

                if (logo == null)
                {
                    _logger.LogWarning("Logo with ID: {Id} was not found.", id);
                    return null;
                }

                var logoDto = new LogoDto
                {
                    Id = logo.Id,
                    ImagePath = logo.ImagePath,
                    CreatedAt = logo.CreatedAt,
                    UpdatedAt = logo.UpdatedAt
                };

                _logger.LogDebug("Successfully retrieved logo with ID: {Id}", id);

                return logoDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving logo with ID: {Id}", id);
                throw;
            }
        }

        public void CreateLogo(LogoDto logoDto)
        {
            try
            {
                _logger.LogInformation("Creating a new logo.");

                var logo = new Domain.Entities.Logo
                {
                    ImagePath = logoDto.ImagePath,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _logo.CreateLogo(logo);

                _logger.LogDebug("Successfully created a new logo with ID: {Id}", logo.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a logo.");
                throw new ApplicationException("An error occurred while creating the logo.", ex);
            }
        }

        public void UpdateLogo(LogoDto logoDto)
        {
            try
            {
                _logger.LogInformation("Updating logo with ID: {Id}", logoDto.Id);

                var logo = _logo.GetLogoById(logoDto.Id);

                if (logo == null)
                {
                    _logger.LogWarning("Logo with ID: {Id} was not found. Update cancelled.", logoDto.Id);
                    return;
                }

                logo.ImagePath = logoDto.ImagePath;
                logo.UpdatedAt = DateTime.Now;

                _logo.UpdateLogo(logo);

                _logger.LogDebug("Successfully updated logo with ID: {Id}", logoDto.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating logo with ID: {Id}", logoDto.Id);
                throw new ApplicationException("An error occurred while updating the logo.", ex);
            }
        }

        public void DeleteLogo(int id)
        {
            try
            {
                _logger.LogInformation("Deleting logo with ID: {Id}", id);

                _logo.DeleteLogo(id);

                _logger.LogDebug("Successfully deleted logo with ID: {Id}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting logo with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the logo.", ex);
            }
        }
    }
}
