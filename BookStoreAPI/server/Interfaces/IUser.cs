using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreAPI.server.Interfaces
{
    public interface IUser
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? deliveryAddress { get; set; }
    }
}
