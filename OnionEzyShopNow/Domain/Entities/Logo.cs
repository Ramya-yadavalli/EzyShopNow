using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Logo
    {
        public int Id { get; set; }
        public string ImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
