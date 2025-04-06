
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Interfaces
{
    public interface IOrderList
    {
        List<Order> Orders { get; set; }
    }
}
