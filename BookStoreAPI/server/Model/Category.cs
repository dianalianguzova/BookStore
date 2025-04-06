
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using BookStoreAPI.server.Interfaces;

namespace BookStoreAPI.server.Model
{
    public class Category : ICategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int category_id { get; set; }
        [Required]
        [Column("name")]
        public string name { get; set; }
    }
}
