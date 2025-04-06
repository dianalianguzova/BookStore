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
    public class BookProduct : IBook
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Required]
        [Column("author")]
        public string Author { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("price")]
        public int Price { get; set; }

        [Required]
        [Column("availablequantity")]
        public int AvailableQuantity { get; set; }

        [Required]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("image")]
        public string? Image { get; set; }

    }
}
