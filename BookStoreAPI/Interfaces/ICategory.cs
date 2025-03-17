using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStoreAPI.Interfaces
{
    public interface ICategory
    {
        public int category_id { get; set; }
        public string name { get; set; }
    }
}
