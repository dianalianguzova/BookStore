using BookStore.Model;
using BookStoreAPI.Model;

namespace BookStoreAPI.Interfaces
{
    public interface ICategoryList
    {
        List<Category> Categories { get; set; }
    }
}
