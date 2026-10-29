using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs
{
    public class LogoDto
    {
        public int Id { get; set; }
        public string ImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
