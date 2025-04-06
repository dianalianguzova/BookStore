

namespace BookStoreAPI.server.Interfaces
{
    public interface IBook
    {
        int ProductId { get; set; }
        string Name { get; set; }
        string Author { get; set; }
        string? Description { get; set; }
        int Price { get; set; }
        int AvailableQuantity { get; set; }
        int CategoryId { get; set; }
        string? Image { get; set; }
    }
}
