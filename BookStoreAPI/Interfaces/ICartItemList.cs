using BookStore.Model;

namespace BookStoreAPI.Interfaces
{
    public interface ICartItemList
    {
        List<CartItem> CartItems { get; set; }
    }
}
