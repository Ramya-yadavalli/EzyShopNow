
using Application.DTOs;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class TopCategoriesService
    {
        private readonly ITopCategories _topCategoriesRepository;
        private readonly ILogger<TopCategoriesService> _logger;

        public TopCategoriesService(
            ITopCategories topCategoriesRepository,
            ILogger<TopCategoriesService> logger)
        {
            _topCategoriesRepository = topCategoriesRepository;
            _logger = logger;
        }

        public List<TopCategoryDto> GetTopCategories()
        {
            try
            {
                _logger.LogInformation("Retrieving all top categories.");

                var topCategories = _topCategoriesRepository.GetTopCategories()
                    .Select(tc => new TopCategoryDto
                    {
                        Id = tc.Id,
                        ImagePath = tc.ImagePath,
                        CategoryName = tc.CategoryName
                    })
                    .ToList();

                _logger.LogDebug("Successfully retrieved all top categories.");

                return topCategories;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving top categories.");
                throw;
            }
        }

        public TopCategoryDto? GetTopCategoryById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving top category with ID: {Id}", id);

                var topCategory = _topCategoriesRepository.GetTopCategoryById(id);

                if (topCategory == null)
                {
                    _logger.LogWarning("Top category with ID: {Id} was not found.", id);
                    return null;
                }

                var topCategoryDto = new TopCategoryDto
                {
                    Id = topCategory.Id,
                    ImagePath = topCategory.ImagePath,
                    CategoryName = topCategory.CategoryName
                };

                _logger.LogDebug("Successfully retrieved top category with ID: {Id}", id);

                return topCategoryDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving top category with ID: {Id}", id);
                throw;
            }
        }

        public bool AddTopCategory(TopCategoryDto topCategory)
        {
            try
            {
                _logger.LogInformation(
                    "Adding a new top category with name: {CategoryName}",
                    topCategory.CategoryName);

                var newTopCategory = new Domain.Entities.TopCategories
                {
                    ImagePath = topCategory.ImagePath,
                    CategoryName = topCategory.CategoryName
                };

                _topCategoriesRepository.AddTopCategory(newTopCategory);

                _logger.LogDebug(
                    "Successfully added top category with name: {CategoryName}",
                    topCategory.CategoryName);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while adding top category: {CategoryName}",
                    topCategory.CategoryName);

                throw new ApplicationException("An error occurred while adding the top category.", ex);
            }
        }

        public bool UpdateTopCategory(TopCategoryDto topCategory)
        {
            try
            {
                _logger.LogInformation("Updating top category with ID: {Id}", topCategory.Id);

                var updatedTopCategory = new Domain.Entities.TopCategories
                {
                    Id = topCategory.Id,
                    ImagePath = topCategory.ImagePath,
                    CategoryName = topCategory.CategoryName
                };

                var result = _topCategoriesRepository.UpdateTopCategory(updatedTopCategory);

                if (result)
                {
                    _logger.LogDebug("Successfully updated top category with ID: {Id}", topCategory.Id);
                }
                else
                {
                    _logger.LogWarning("Top category with ID: {Id} could not be updated.", topCategory.Id);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating top category with ID: {Id}", topCategory.Id);
                throw new ApplicationException("An error occurred while updating the top category.", ex);
            }
        }

        public bool DeleteTopCategory(int id)
        {
            try
            {
                _logger.LogInformation("Deleting top category with ID: {Id}", id);

                var topCategory = _topCategoriesRepository.GetTopCategoryById(id);

                if (topCategory == null)
                {
                    _logger.LogWarning("Top category with ID: {Id} was not found. Delete cancelled.", id);
                    return false;
                }

                var result = _topCategoriesRepository.DeleteTopCategory(topCategory.Id);

                if (result)
                {
                    _logger.LogDebug("Successfully deleted top category with ID: {Id}", id);
                }
                else
                {
                    _logger.LogWarning("Top category with ID: {Id} could not be deleted.", id);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting top category with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the top category.", ex);
            }
        }
    }
}
