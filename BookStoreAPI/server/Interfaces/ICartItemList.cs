using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Interfaces
{
    public interface ICartItemList
    {
        List<CartItem> CartItems { get; set; }
    }
}
