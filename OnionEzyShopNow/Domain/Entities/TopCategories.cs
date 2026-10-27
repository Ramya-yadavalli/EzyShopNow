using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain.Entities
{
    public class TopCategories
    {
        
        public int Id { get; set; }
        public string ImagePath { get; set; }
        public string CategoryName { get; set; }
    }
}
