using BookStore.Model;
using BookStoreAPI.Interfaces;

namespace BookStoreAPI.Model.Lists
{
    public class UserList : IUserList
    {
        public List<User> Users { get; set; } = new List<User>();
    }
}
