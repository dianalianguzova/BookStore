using BookStore.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using BookStoreAPI.Interfaces;

namespace BookStoreAPI.Model
{
    public class User : IUser
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        [Column("user_id")]
        public int UserId { get; set; }
        [Column("name")]
        public string? Name { get; set; }

        [Column("surname")]
        public string? Surname { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("phone")]
        public string? Phone{ get; set; }
        [Column("deliveryaddress")]
        public string deliveryAddress { get; set; }
    }
}
