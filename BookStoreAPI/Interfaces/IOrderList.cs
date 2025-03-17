using BookStore.Model;
using BookStoreAPI.Model;

namespace BookStoreAPI.Interfaces
{
    public interface IOrderList
    {
        List<Order> Orders { get; set; }
    }
}
