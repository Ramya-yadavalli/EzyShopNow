using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class TopCategoriesService
    {
        private readonly ITopCategories _topCategoriesRepository;
        public TopCategoriesService(ITopCategories topCategoriesRepository)
        {
            _topCategoriesRepository = topCategoriesRepository;
        }
        public List<TopCategoryDto> GetTopCategories()
     
         =>   _topCategoriesRepository.GetTopCategories().Select(tc => new TopCategoryDto
            {
                Id = tc.Id,
                ImagePath = tc.ImagePath,
                CategoryName = tc.CategoryName
            }).ToList();
        
        public TopCategoryDto GetTopCategoryById(int id)
        {
            var topCategory = _topCategoriesRepository.GetTopCategoryById(id);
            return new TopCategoryDto
            {
                Id = topCategory.Id,
                ImagePath = topCategory.ImagePath,
                CategoryName = topCategory.CategoryName
            };
        }
        public bool AddTopCategory(TopCategoryDto topCategory)
        {
            var newTopCategory = new Domain.Entities.TopCategories
            {
                ImagePath = topCategory.ImagePath,
                CategoryName = topCategory.CategoryName
            };
            _topCategoriesRepository.AddTopCategory(newTopCategory);
            return true;
        }
        public bool UpdateTopCategory(TopCategoryDto topCategory)
        {
            var updatedTopCategory = new Domain.Entities.TopCategories
            {
                Id = topCategory.Id,
                ImagePath = topCategory.ImagePath,
                CategoryName = topCategory.CategoryName
            };
            return _topCategoriesRepository.UpdateTopCategory(updatedTopCategory);                      
        }
        public bool DeleteTopCategory(int id)
        {
            var topCategory = _topCategoriesRepository.GetTopCategoryById(id);
            return _topCategoriesRepository.DeleteTopCategory(topCategory.Id);
        }
    }
}
