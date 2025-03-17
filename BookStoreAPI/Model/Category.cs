
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using BookStoreAPI.Interfaces;

namespace BookStore.Model
{
    public class Category : ICategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int category_id { get; set; }
        [Required]
        [Column("name")]
        public string name { get; set; }
    }
}
