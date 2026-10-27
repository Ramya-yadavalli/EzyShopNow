using System;
using System.Collections.Generic;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.Entities
{
    public class TrendingProducts
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        public int Discount { get; set; }
        public decimal Rating { get; set; }
        public decimal Reviews { get; set; }
        public string ImagePath { get; set; }
        public string Badge { get; set; }
        
    }
}
