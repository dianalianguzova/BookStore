
using BookStoreAPI.server.DB;
using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;
using BookStoreAPI.server.Model.Lists;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreAPI.server.Controllers
{
    [Route("/order")]
    [ApiController]
    public class OrderController : Controller
    {

        private readonly DbConnection db;
        public OrderController(DbConnection dbContext)
        {
            db = dbContext;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IOrderList>> GetAllOrder()//получить все заказы 
        {
            var orders = await db.Order.Include(o => o.OrderItems).ToListAsync();
            if (orders == null || !orders.Any()) return NotFound("Orders not found");
            var orderList = orders.OrderBy(c => c.date).ToList();
            IOrderList response = new OrderList { Orders = orderList };
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IOrder>> GetOrderById(int id)//получить заказ по айди
        {
            IOrder response = await db.Order.FindAsync(id);
            if (response == null) return NotFound("Order product with id " + id + " not found");
            return Ok(response);
        }

        [HttpGet("{id}/item/{itemid}")]
        public async Task<ActionResult<IBook>> GetProductInfoById(int id, int itemid) // получить информацию о продукте через айди
        {
            var order = await db.Order.Include(c => c.OrderItems).FirstOrDefaultAsync(c => c.order_id == id);
            if (order == null) return NotFound("Order with id " + id + " not found.");
            var orderItem = order.OrderItems.FirstOrDefault(ci => ci.ProductId == itemid);
            if (orderItem == null) return NotFound("Order item with id " + itemid + " not found in order with id " + id);
            IBook product = await db.BookProduct.FindAsync(orderItem.ProductId);
            if (product == null) return NotFound("Product with id " + orderItem.ProductId + " not found");
            return Ok(product);
        }

        [HttpPost("")]
        public async Task<IActionResult> PostNewOrder(int userId)//добавление нового заказа
        {
            var cart = await db.Cart.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null || !cart.CartItems.Any()) return BadRequest("Cart is empty or not found for user with id " + userId);
            List<OrderItem> items = new List<OrderItem>();
            foreach (var cartItem in cart.CartItems)
            {
                var product = await db.BookProduct.FindAsync(cartItem.ProductId);
                if (product == null) return NotFound("Product not found");

                if (cartItem.ProductQuantity > product.AvailableQuantity)
                    return BadRequest("Not enough available quantity for product with id " + cartItem.ProductId + ", available quantity: " + product.AvailableQuantity);

                items.Add(new OrderItem { ProductId = cartItem.ProductId, ProductQuantity = cartItem.ProductQuantity });

                product.AvailableQuantity -= cartItem.ProductQuantity; //уменьшаем количество доступных продуктов на количество заказанных
                db.BookProduct.Update(product);
                await db.SaveChangesAsync();
            }
            var user = await db.User.FindAsync(userId);
            var newOrder = new Order
            {
                user_id = userId,
                totalAmount = items.Count(),
                date = DateTime.UtcNow,
                deliveryAddress = user.deliveryAddress,
                status = "Created",
                OrderItems = items
            };
            foreach (var item in newOrder.OrderItems) item.OrderId = newOrder.order_id;
            db.Order.Add(newOrder);
            db.CartItem.RemoveRange(cart.CartItems);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllOrder), new { id = newOrder.order_id }, newOrder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, [FromBody] Order updatedOrderProduct)//изменение заказа
        {
            var order = await db.Order.FindAsync(id);
            if (order == null) return NotFound("Order product with id " + id + " not found.");
            order.date = updatedOrderProduct.date;
            order.status = updatedOrderProduct.status;
            order.deliveryAddress = updatedOrderProduct.deliveryAddress;
            order.user_id = updatedOrderProduct.user_id;
            order.totalAmount = updatedOrderProduct.totalAmount;
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)//удаление заказа
        {
            var order = await db.Order.FindAsync(id);
            if (order == null) return NotFound("Order product with id " + id + " not found.");
            db.Order.Remove(order);
            await db.SaveChangesAsync();
            return NoContent();
        }


    }
}
