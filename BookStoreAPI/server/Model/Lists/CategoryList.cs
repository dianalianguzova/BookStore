using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Model.Lists
{
    public class CategoryList : ICategoryList
    {
        public List<Category> Categories { get; set; } = new List<Category>();
    }
}
