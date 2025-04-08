using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace BookStoreAPI.server.Model
{
    public class CartItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("cart_item_id")]
        public int CartItemId { get; set; }
        [Column("cart_id")]
        public int CartId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }
        [Required]
        [Column("product_quantity")]
        public int ProductQuantity { get; set; }
        
    }
}
