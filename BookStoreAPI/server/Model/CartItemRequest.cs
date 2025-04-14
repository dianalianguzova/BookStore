namespace BookStoreAPI.server.Model
{
    public class CartItemRequest
    {
        public CartItem Item { get; set; }
        public bool Auth { get; set; }
    }
}
