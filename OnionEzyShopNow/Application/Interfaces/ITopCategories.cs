using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface ITopCategories
    {
        List<TopCategories> GetTopCategories();
        TopCategories GetTopCategoryById(int id);
        bool AddTopCategory(TopCategories topCategories);
        bool UpdateTopCategory(TopCategories topCategories);
        bool DeleteTopCategory(int id);


    }
}
