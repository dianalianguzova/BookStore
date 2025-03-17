using BookStore.Model;
using BookStoreAPI.Interfaces;

namespace BookStoreAPI.Model.Lists
{
    public class CartItemList  : ICartItemList
    {
        public List<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
