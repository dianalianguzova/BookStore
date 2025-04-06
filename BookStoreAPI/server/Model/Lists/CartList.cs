using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Model.Lists
{
    public class CartList : ICartList
    {
        public List<Cart> Carts { get; set; } = new List<Cart>();
    }
}
