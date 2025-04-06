using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using BookStoreAPI.server.Model;

namespace BookStoreAPI.server.Interfaces
{
    public interface ICart
    {

        public int CartId { get; set; }
        public string? SessionId { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public List<CartItem> CartItems { get; set; }

    }
}
