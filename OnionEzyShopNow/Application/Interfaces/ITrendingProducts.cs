using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface ITrendingProducts
    {
        List<TrendingProducts> GetTrendingProducts();
        TrendingProducts GetTrendingProductById(int id);
        bool AddTrendingProduct(TrendingProducts trendingProduct);
        bool UpdateTrendingProduct(TrendingProducts trendingProduct);
        bool DeleteTrendingProduct(int id);
    }
}
