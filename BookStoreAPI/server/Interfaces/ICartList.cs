using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Interfaces
{
    public interface ICartList
    {
        List<Cart> Carts { get; set; }
    }
}
