using BookStore.Model;

namespace BookStoreAPI.Interfaces
{
    public interface ICartList
    {
        List<Cart> Carts { get; set; }
    }
}
