using BookStore.Model;
using BookStoreAPI.Interfaces;

namespace BookStoreAPI.Model.Lists
{
    public class CartList : ICartList
    {
        public List<Cart> Carts { get; set; } = new List<Cart>();
    }
}
