
using BookStoreAPI.server.DB;
using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;
using BookStoreAPI.server.Model.Lists;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BookStoreAPI.server.Controllers
{
    [Route("/user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly DbConnection db;
        public UserController(DbConnection dbContext)
        {
            db = dbContext;
        }
        //[HttpGet]
        //public IActionResult Index()
        //{
        //    if (User.Identity.IsAuthenticated) //если пользователь зарегестрирован
        //    {
        //        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        //        var userName = User.Identity.Name;
        //    }
        //    else
        //    {
        //        return RedirectToAction("Login", "Account");
        //    }
        //    return View();
        //}

        [HttpGet("{id}")]
        public async Task<ActionResult<IUser>> GetUserInfo(int id)//информация о пользователе
        {
            var user = await db.User.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound("User  not found.");
            IUser response = user;
            return Ok(response);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IUserList>> GetAllUsers()//весь список пользователей
        {
            var users = await db.User.ToListAsync();
            if (users == null || !users.Any()) return NotFound("Users not found.");
            var usersList = users.ToList();
            IUserList response = new UserList { Users = usersList };
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> PostNewUser([FromBody] User newUser)
        //string sessionId) // добавление нового пользователя
        {
            db.User.Add(newUser);
            await db.SaveChangesAsync();
            var cart = new Cart { UserId = newUser.UserId };
            //var sessionCart = await db.Cart.FirstOrDefaultAsync(c => c.SessionId == sessionId); //товары из сессионной корзины в обычную
            //if (sessionCart != null) {
            //    var cartItems = await db.CartItem.Where(ci => ci.CartId == sessionCart.CartId).ToListAsync();
            //    foreach (var item in cartItems)
            //    {
            //        item.CartId = cart.CartId; 
            //        db.CartItem.Update(item); 
            //    }
            //    db.Cart.Remove(sessionCart);
            //}
            db.Cart.Add(cart); //создание корзины автоматически
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserInfo), new { id = newUser.UserId }, newUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromBody] User updatedUser)//изменить данные пользователя (только для этого пользователя или админа)
        {
            var user = await db.User.FindAsync(id);
            if (user == null) return NotFound();
            user.Name = updatedUser.Name;
            user.Surname = updatedUser.Surname;
            user.Phone = updatedUser.Phone;
            user.Email = updatedUser.Email;
            await db.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("{id}/orders")]
        public async Task<ActionResult<IOrderList>> GetAllUserOrders(int id)
        {//все заказы пользователя
            var user = await db.User.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound("User  not found.");
            var orders = await db.Order.Where(o => o.user_id == id).ToListAsync();
            if (orders == null || !orders.Any()) return Ok(new { Message = "No orders found for user with id " + id });
            return Ok(orders);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await db.User.FindAsync(id);
            if (user == null) return NotFound("User not found.");
            var cart = await db.Cart.FirstOrDefaultAsync(c => c.UserId == id);
            if (cart != null) db.Cart.Remove(cart);
            db.User.Remove(user);
            await db.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("{id}/cart")]
        public async Task<ActionResult<CartItemList>> GetAllUserCartContent(int id) //содержимое корзины пользователя
        {
            var cart = await db.Cart.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == id);
            if (cart == null) return Ok(new { Message = "No cart items found in cart for user with id " + id });
            var cartContent = new CartItemList { CartItems = cart.CartItems };
            return Ok(cartContent);
        }
    }
}
