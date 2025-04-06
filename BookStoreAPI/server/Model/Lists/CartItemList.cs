using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Model.Lists
{
    public class CartItemList : ICartItemList
    {
        public List<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
