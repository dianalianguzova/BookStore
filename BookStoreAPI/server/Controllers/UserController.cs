
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
    [Produces("application/json")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly DbConnection db;
        public UserController(DbConnection dbContext)
        {
            db = dbContext;
        }

        [HttpGet("check-mail/{mail}")]
        public async Task<ActionResult<IUser>> CheckPhone(string mail){
            var user = await db.User.FirstOrDefaultAsync(u => u.Email == mail);
            if (user == null) return NotFound("User  not found.");
            IUser response = user;
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IUser>> GetUserInfo(int id)//информация о пользователе
        {
            var user = await db.User.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound("User  not found.");
            IUser response = user;
            return Ok(response);
        }

        [HttpGet("{id}/cart")]
        public async Task<ActionResult<CartItemList>> GetAllUserCartContent(int id) //содержимое корзины пользователя
        {
            var cart = await db.Cart.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == id);
            if (cart == null) return Ok(new { Message = "No cart items found in cart for user with id " + id });
            var cartContent = new CartItemList { CartItems = cart.CartItems };
            return Ok(cartContent);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromBody] User updatedUser)
        {
            var user = await db.User.FindAsync(id);
            if (user == null) return NotFound();
            user.Name = updatedUser.Name;
            user.Surname = updatedUser.Surname;
            user.Phone = updatedUser.Phone;
            user.deliveryAddress = updatedUser.deliveryAddress;
            await db.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("{id}/orders")]
        public async Task<ActionResult<IOrderList>> GetAllUserOrders(int id)
        {
            var user = await db.User.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound("User  not found.");

            var orders = await db.Order.Include(o => o.OrderItems).
                Where(o => o.user_id == id).OrderByDescending(o => o.date).
                ToListAsync();
            if (orders == null) return NotFound("Orders not found.");
            return Ok(orders);
        }

        [HttpPost("register")]
        public async Task<IActionResult> PostNewUser([FromBody] User newUser) //регистрация пользователя
        {
            db.User.Add(newUser);
            await db.SaveChangesAsync();
            var cart = new Cart { UserId = newUser.UserId };
            db.Cart.Add(cart); //создание корзины автоматически
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserInfo), new { id = newUser.UserId }, newUser);
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await db.User.FindAsync(id);
            if (user == null) return NotFound("User not found.");
            user.isDeleted = true;
            await db.SaveChangesAsync();
            return NoContent();
        }

    }
}
