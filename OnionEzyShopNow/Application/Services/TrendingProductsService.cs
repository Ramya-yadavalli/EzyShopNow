using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class TrendingProductsService
    {
        private readonly ITrendingProducts _trendingProductsRepository;
        public TrendingProductsService(ITrendingProducts trendingProductsRepository)
        {
            _trendingProductsRepository = trendingProductsRepository;
        }
        public List<TrendingProductsDto> GetTrendingProducts()
            => _trendingProductsRepository.GetTrendingProducts().Select(tp => new TrendingProductsDto
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
            }).ToList();
        public TrendingProductsDto GetTrendingProductById(int id)
        {
            var trendingProduct = _trendingProductsRepository.GetTrendingProductById(id);
            return new TrendingProductsDto
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
        }
        public bool AddTrendingProduct(TrendingProductsDto trendingProduct)
        {
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
            return true;
        }
        public bool UpdateTrendingProduct(TrendingProductsDto trendingProduct)
        {
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
            return _trendingProductsRepository.UpdateTrendingProduct(updatedTrendingProduct);
        }
        public bool DeleteTrendingProduct(int id)
        {
            return _trendingProductsRepository.DeleteTrendingProduct(id);
        }
    }
}
