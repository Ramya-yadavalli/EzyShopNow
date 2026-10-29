using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface ILogo
    {
        List<Logo> GetLogos();
        Logo GetLogoById(int id);
        void CreateLogo(Logo logo);
        void UpdateLogo(Logo logo);
        void DeleteLogo(int id);

    }
}
