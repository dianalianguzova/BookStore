﻿
using BookStoreAPI.server.DB;
using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;
using BookStoreAPI.server.Model.Lists;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreAPI.server.Controllers
{
    [Route("")]
    [ApiController]
    [Produces("application/json")]
    public class BookProducsController : Controller
    {
        private readonly DbConnection db;
        public BookProducsController(DbConnection dbContext)
        {
            db = dbContext;
        }

        [HttpGet("")]
        public async Task<ActionResult<IBookList>> GetAllBooksProduct()//получение списка всех книжных продуктов
        {
            var products = await db.BookProduct.ToListAsync();
            if (products == null || !products.Any()) return NotFound("Book products not found.");
          //  var sortedBookProducts = products.OrderBy(b => b.CategoryId).ToList();
            var sortedBookProducts = products.ToList();
            IBookList response = new BookProductsList { BookProducts = sortedBookProducts };
            return Ok(response);
        }


        [HttpGet("/product/{id}")]
        public async Task<ActionResult<IBook>> GetBookInfo(int id) //информация об одном книжном продукте
        {
            //  if(db.BookProduct == null) return NotFound("Book product not found.");
            IBook response = await db.BookProduct.FindAsync(id);
            if (response == null) return NotFound("Book product with id " + id + " not found.");
            return Ok(response);
        }

        [HttpPost("")]
        public async Task<IActionResult> PostNewBookProduct([FromBody] BookProduct newBookProduct)//добавление нового книжного продукта 
        {
            db.BookProduct.Add(newBookProduct);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllBooksProduct), new { id = newBookProduct.ProductId }, newBookProduct);
        }

        [HttpPut("/products/{id}")]
        public async Task<IActionResult> PutBookProduct(int id, [FromBody] BookProduct updatedBookProduct)//изменение книжного продукта 
        {
            var product = await db.BookProduct.FindAsync(id);
            if (product == null) return NotFound("Book product with id " + id + " not found.");
            product.Name = updatedBookProduct.Name;
            product.Author = updatedBookProduct.Author;
            product.Description = updatedBookProduct.Description;
            product.Price = updatedBookProduct.Price;
            product.AvailableQuantity = updatedBookProduct.AvailableQuantity;
            product.CategoryId = updatedBookProduct.CategoryId;
            product.Image = updatedBookProduct.Image;
            await db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("/products/{id}")]
        public async Task<IActionResult> DeleteBookProduct(int id)//удаление книжного продукта 
        {
            var product = await db.BookProduct.FindAsync(id);
            if (product == null) return NotFound("Book product with id " + id + " not found.");
            db.BookProduct.Remove(product);
            await db.SaveChangesAsync();
            return NoContent();
        }
    }
}
