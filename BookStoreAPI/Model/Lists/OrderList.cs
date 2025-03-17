using BookStore.Model;
using BookStoreAPI.Interfaces;

namespace BookStoreAPI.Model.Lists
{
    public class OrderList : IOrderList
    {
        public List<Order> Orders { get; set; } = new List<Order>();
    }
}
