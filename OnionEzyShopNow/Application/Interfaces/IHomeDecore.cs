using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface IHomeDecore
    {
        List<HomeDecore> GetHomeDecores();
        HomeDecore GetHomeDecoreById(int id);
        void AddHomeDecore(HomeDecore homeDecore);
        void UpdateHomeDecore(HomeDecore homeDecore);
        void DeleteHomeDecore(int id);

    }
}
