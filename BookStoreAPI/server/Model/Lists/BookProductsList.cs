using BookStoreAPI.server.Interfaces;
using BookStoreAPI.server.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreAPI.server.Model.Lists
{
    public class BookProductsList : IBookList
    {
        public List<BookProduct> BookProducts { get; set; } = new List<BookProduct>();
    }
}
