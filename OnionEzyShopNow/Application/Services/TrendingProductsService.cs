
using Application.DTOs;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class TrendingProductsService
    {
        private readonly ITrendingProducts _trendingProductsRepository;
        private readonly ILogger<TrendingProductsService> _logger;

        public TrendingProductsService(
            ITrendingProducts trendingProductsRepository,
            ILogger<TrendingProductsService> logger)
        {
            _trendingProductsRepository = trendingProductsRepository;
            _logger = logger;
        }

        public List<TrendingProductsDto> GetTrendingProducts()
        {
            try
            {
                _logger.LogInformation("Retrieving all trending products.");

                var trendingProducts = _trendingProductsRepository.GetTrendingProducts()
                    .Select(tp => new TrendingProductsDto
                    {
                        Id = tp.Id,
                        ImagePath = tp.ImagePath,
                        Name = tp.Name,
                        Category = tp.Category,
                        Price = tp.Price,
                        OriginalPrice = tp.OriginalPrice,
                        Discount = tp.Discount,
                        Rating = tp.Rating,
                        Reviews = tp.Reviews,
                        Badge = tp.Badge
                    })
                    .ToList();

                _logger.LogDebug("Successfully retrieved all trending products.");

                return trendingProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving trending products.");
                throw;
            }
        }

        public TrendingProductsDto? GetTrendingProductById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving trending product with ID: {Id}", id);

                var trendingProduct = _trendingProductsRepository.GetTrendingProductById(id);

                if (trendingProduct == null)
                {
                    _logger.LogWarning("Trending product with ID: {Id} was not found.", id);
                    return null;
                }

                var trendingProductDto = new TrendingProductsDto
                {
                    Id = trendingProduct.Id,
                    ImagePath = trendingProduct.ImagePath,
                    Name = trendingProduct.Name,
                    Category = trendingProduct.Category,
                    Price = trendingProduct.Price,
                    OriginalPrice = trendingProduct.OriginalPrice,
                    Discount = trendingProduct.Discount,
                    Rating = trendingProduct.Rating,
                    Reviews = trendingProduct.Reviews,
                    Badge = trendingProduct.Badge
                };

                _logger.LogDebug("Successfully retrieved trending product with ID: {Id}", id);

                return trendingProductDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving trending product with ID: {Id}", id);
                throw;
            }
        }

        public bool AddTrendingProduct(TrendingProductsDto trendingProduct)
        {
            try
            {
                _logger.LogInformation(
                    "Adding a new trending product with name: {Name}",
                    trendingProduct.Name);

                var newTrendingProduct = new Domain.Entities.TrendingProducts
                {
                    ImagePath = trendingProduct.ImagePath,
                    Name = trendingProduct.Name,
                    Category = trendingProduct.Category,
                    Price = trendingProduct.Price,
                    OriginalPrice = trendingProduct.OriginalPrice,
                    Discount = trendingProduct.Discount,
                    Rating = trendingProduct.Rating,
                    Reviews = trendingProduct.Reviews,
                    Badge = trendingProduct.Badge
                };

                _trendingProductsRepository.AddTrendingProduct(newTrendingProduct);

                _logger.LogDebug(
                    "Successfully added trending product with name: {Name}",
                    trendingProduct.Name);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while adding trending product: {Name}",
                    trendingProduct.Name);

                throw new ApplicationException("An error occurred while adding the trending product.", ex);
            }
        }

        public bool UpdateTrendingProduct(TrendingProductsDto trendingProduct)
        {
            try
            {
                _logger.LogInformation(
                    "Updating trending product with ID: {Id}",
                    trendingProduct.Id);

                var updatedTrendingProduct = new Domain.Entities.TrendingProducts
                {
                    Id = trendingProduct.Id,
                    ImagePath = trendingProduct.ImagePath,
                    Name = trendingProduct.Name,
                    Category = trendingProduct.Category,
                    Price = trendingProduct.Price,
                    OriginalPrice = trendingProduct.OriginalPrice,
                    Discount = trendingProduct.Discount,
                    Rating = trendingProduct.Rating,
                    Reviews = trendingProduct.Reviews,
                    Badge = trendingProduct.Badge
                };

                var result = _trendingProductsRepository.UpdateTrendingProduct(updatedTrendingProduct);

                if (result)
                {
                    _logger.LogDebug(
                        "Successfully updated trending product with ID: {Id}",
                        trendingProduct.Id);
                }
                else
                {
                    _logger.LogWarning(
                        "Trending product with ID: {Id} could not be updated.",
                        trendingProduct.Id);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while updating trending product with ID: {Id}",
                    trendingProduct.Id);

                throw new ApplicationException("An error occurred while updating the trending product.", ex);
            }
        }

        public bool DeleteTrendingProduct(int id)
        {
            try
            {
                _logger.LogInformation("Deleting trending product with ID: {Id}", id);

                var result = _trendingProductsRepository.DeleteTrendingProduct(id);

                if (result)
                {
                    _logger.LogDebug("Successfully deleted trending product with ID: {Id}", id);
                }
                else
                {
                    _logger.LogWarning("Trending product with ID: {Id} could not be deleted.", id);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting trending product with ID: {Id}", id);
                throw new ApplicationException("An error occurred while deleting the trending product.", ex);
            }
        }
    }
}
