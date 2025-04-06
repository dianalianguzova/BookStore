using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Model.Lists
{
    public class OrderList : IOrderList
    {
        public List<Order> Orders { get; set; } = new List<Order>();
    }
}
