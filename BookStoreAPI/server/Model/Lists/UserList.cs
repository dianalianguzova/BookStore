
using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Model.Lists
{
    public class UserList : IUserList
    {
        public List<User> Users { get; set; } = new List<User>();
    }
}
