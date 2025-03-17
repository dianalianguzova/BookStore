using BookStore.Model;
using BookStoreAPI.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStoreAPI.Interfaces
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
