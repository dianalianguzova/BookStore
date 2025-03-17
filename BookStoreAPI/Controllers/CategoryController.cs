using BookStore.DB;
using BookStore.Interfaces;
using BookStore.Model;
using BookStoreAPI.Interfaces;
using BookStoreAPI.Model;
using BookStoreAPI.Model.Lists;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreAPI.Controllers
{
    [Route("/categories")]
    [ApiController]
    public class CategoryController : Controller
    {
        private readonly DbConnection db;
        public CategoryController(DbConnection dbContext)
        {
            db = dbContext;
        }

        [HttpGet("")]
        public async Task<ActionResult<ICategoryList>> GetAllCategories()//получить названия всех категорий
        {
            var categories = await db.Category.ToListAsync();
            if (categories == null || !categories.Any()) return NotFound("Categories not found.");
            var categoryList = categories.OrderBy(c=>c.name).ToList();
            ICategoryList response = new CategoryList { Categories = categoryList };
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IBookList>> GetCategoryProducts(int id)//получить продукты по категории
        {
            IBookList response = new BookProductsList();
            if (db.BookProduct == null || !db.BookProduct.Any()) return NotFound("Products not found.");
            var products = db.BookProduct.AsQueryable();
            var books = products.Where(b => b.CategoryId == id).ToList();
            response.BookProducts = books;
            return Ok(response);
        }

        [HttpPost("")]
        public async Task<IActionResult> PostNewCategory([FromBody] Category newCategory)//создать новую категорию
        {
            db.Category.Add(newCategory);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllCategories), new { id = newCategory.category_id }, newCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromBody] Category updatedCategory)//изменить категорию
        {
            var category = await db.Category.FindAsync(id);
            if (category == null) return NotFound("Category with id " + id + " not found.");
            category.name = updatedCategory.name;
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await db.Category.FindAsync(id);
            if (category == null) return NotFound("Category with id " + id + " not found.");
            db.Category.Remove(category);
            await db.SaveChangesAsync();
            return NoContent();
        }
    }
}
