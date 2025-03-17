using BookStore.Model;
using BookStoreAPI.Interfaces;

namespace BookStoreAPI.Model.Lists
{
    public class CategoryList : ICategoryList
    {
        public List<Category> Categories { get; set; } = new List<Category>();
    }
}
