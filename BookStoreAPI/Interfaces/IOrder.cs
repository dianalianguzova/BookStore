using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BookStore.Model;

namespace BookStoreAPI.Interfaces
{
    public interface IOrder
    {
        public int order_id { get; set; }

        public int user_id { get; set; }

        public DateTime date { get; set; }
        public string status { get; set; }

        public int totalAmount { get; set; }
        public string deliveryAddress { get; set; }
        public List<OrderItem> OrderItems { get; set; }
    }
    
}
