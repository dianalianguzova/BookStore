using BookStore.Model;
using BookStoreAPI.Model;

namespace BookStoreAPI.Interfaces
{
    public interface IUserList
    {
        List<User> Users { get; set; }
    }
}
