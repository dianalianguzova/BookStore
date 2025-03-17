
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStoreAPI.Interfaces;
using System.Text.Json.Serialization;

namespace BookStore.Model
{
    public class Order : IOrder
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int order_id { get; set; }

        [Column("user_id")]
        public int user_id { get; set; }

        [Column("date")]
        public DateTime date { get; set; }

        [Column("status")]
        public string status { get; set; }


        [Column("totalamount")]
        public int totalAmount { get; set; }

        [Column("deliveryaddress")]
        public string deliveryAddress { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
