using BookStoreAPI.server.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreAPI.server.Interfaces
{
    public interface IBookList
    {
        List<BookProduct> BookProducts { get; set; }
    }
}
