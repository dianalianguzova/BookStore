using BookStoreAPI.server.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BookStoreAPI.server.Model
{
    public class Cart : ICart
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("cart_id")]
        public int CartId { get; set; }
        [Column("session_id")]
        public string? SessionId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }
        public List<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
