using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class BlogPost
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime Date { get; set; } = DateTime.Now;

        public string Category { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        // Stores the uploaded image's path
        public string ImagePath { get; set; } = string.Empty;
        
    }
}
