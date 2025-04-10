
document.addEventListener('DOMContentLoaded', function () {
    getCartProducts();
});

async function getCartProducts() { //продукты в корзине
    const userId = localStorage.getItem('userId');
    const sessionId = localStorage.getItem('sessionId');
    let id = userId;
    if (!userId && sessionId) { //если найден sessionId
        try {
            const cartResponse = await fetch(`https://localhost:5001/cart/session/${sessionId}`);
            if (!cartResponse.ok) throw new Error('Ошибка загрузки');
            const cartData = await cartResponse.json();
            if (cartData) {
                id = cartData; //получен айди корзины
            }
            else return;
        } catch (error) {
            return; 
        }
    }

    try {
        const response = await fetch(`https://localhost:5001/cart/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        const data = await response.json();
        console.log('Data from API:', data);
        renderProducts(data);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function renderProducts(data) { //список
    if (!data) {
        container.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        return;
    }
    const container = document.getElementById('cart-container');
    if (!container) return;
    const products = data.cartItems;
    console.log('Data:', products);
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        return;
    }

    let html = '';
    const productMap = new Map(); //группировка по id
    try {
        for (const cartItem of products) {
            const productResponse = await fetch(`https://localhost:5001/cart/${cartItem.cartId}/item/${cartItem.cartItemId}`);
            if (productResponse.ok) {
                const product = await productResponse.json();
                const productId = cartItem.productId;
                if (productMap.has(productId)) {
                    const existingItem = productMap.get(productId);
                    existingItem.quantity += cartItem.productQuantity; 
                }
                else {
                    productMap.set(productId, {
                        name: product.name || 'Undefined',
                        price: product.price || 0,
                        quantity: cartItem.productQuantity || 1,
                        image: product.image || '../images/plug.png'});
                }
            }
            //пока закоменчено, чтобы при неправильной загрузке одного товара она не обрывалась
            //else {
             //   console.error(`Ошибка загрузки товара ${cartItem.cartItemId}:`, error);
              //  return;
           // }
        }

        let total = 0;
        for (const [productId, item] of productMap) {
            const itemTotal = item.price * item.quantity; //общая сумма за каждый продукт
            total += itemTotal;
            html += `<div class="cart-item">
                    <div class="product-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="product-name">${item.name}</div>
                    </div>
                    <div class="product-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <div class="product-total">${itemTotal} руб.</div>
                    <button class="remove-btn">x</button>
                </div>`;
        }
        html += `<div class="cart-footer">
                <div class="total-sum">Итого: ${total} руб.</div>
                <button class="checkout-btn">Сделать заказ</button>
            </div>`;
        container.innerHTML = html;
     //   addCartEventListeners(); //нажатия кнопок 
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

//function addCartEventListeners() {
//    document.querySelectorAll('.quantity-btn').forEach(btn => {
//        btn.addEventListener('click', function () {
//            console.log('Quantity button clicked');
//        });
//    });

//    document.querySelectorAll('.remove-btn').forEach(btn => {
//        btn.addEventListener('click', function () {
//            console.log('Remove button clicked');
//        });
//    });

//    document.querySelector('.checkout-btn')?.addEventListener('click', function () {
//        console.log('Checkout button clicked');
//    });
//}