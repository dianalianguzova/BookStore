import { cartItemsCount, userId, sessionId,globalCartItemsCount,  setGlobalCount, saveCartState } from './bookstore.js';

let glob; 
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
            console.error('Ошибка:', error);
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
        return;
    }
}

async function renderProducts(data) {
    const container = document.getElementById('cart-container');
    if (!container) return;
    if (!data || !data.cartItems || data.cartItems.length === 0) {
        container.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        return; 
    }

    let html = '';
    let total = 0;
    try {
        for (const cartItem of data.cartItems) {
            const productResponse = await fetch(`https://localhost:5001/cart/${cartItem.cartId}/item/${cartItem.cartItemId}`);

            if (productResponse.ok) {
                const product = await productResponse.json();
                const itemTotal = product.price * cartItem.productQuantity;
                total += itemTotal;
                html += `<div class="cart-item" 
                         data-product-id="${cartItem.productId}" 
                         data-cart-item-id="${cartItem.cartItemId}"
                         data-price="${product.price}">
                        <div class="product-info">
                            <img src="${product.image || '../images/plug.png'}" 
                                 alt="${product.name || 'Undefined'}">
                            <div class="product-name">${product.name || 'Undefined'}</div>
                        </div>
                        <div class="product-quantity">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${cartItem.productQuantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <div class="product-total">${itemTotal} руб.</div>
                        <button class="remove-btn">x</button>
                    </div>`;
            }
        }

        html += `<div class="cart-footer">
                <div class="total-sum">${total} руб.</div>
                <button class="order-btn">Сделать заказ</button>
            </div>`;
        container.innerHTML = html;
        addCartEventListeners();
    } catch (error) {
        console.error('Ошибка:', error);
        container.innerHTML = '<div class="error">Ошибка загрузки корзины</div>';
    }
}

function addCartEventListeners() {
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', async function () {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.getAttribute('data-product-id');
            const cartItemId = cartItem.getAttribute('data-cart-item-id');
            setGlobalCount(globalCartItemsCount + 1); //прибавляем к счетчику 
            cartItemsCount[productId]++; //для отображения кнопок
            await updateCartItemQuantity(cartItemId, productId, 1);
            saveCartState();
        });
       
    });

    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', async function () {
       
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.getAttribute('data-product-id');
            const cartItemId = cartItem.getAttribute('data-cart-item-id');
            setGlobalCount(globalCartItemsCount - 1);
            cartItemsCount[productId]--;
            await updateCartItemQuantity(cartItemId, productId, -1);
            saveCartState();
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async function () {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.getAttribute('data-product-id');
            const cartItemId = cartItem.getAttribute('data-cart-item-id');

            const quantityElement = cartItem.querySelector('.quantity');
            const quantityToRemove = parseInt(quantityElement.textContent);
            if (cartItemsCount[productId] !== undefined) delete cartItemsCount[productId]; 
            setGlobalCount(globalCartItemsCount - quantityToRemove); //удаляем из глобаольного счетчика столько, сколько товара было в корзине
            await removeCartItem(cartItemId, productId);
            saveCartState();
        });
        
    });

    //document.querySelector('.order-btn')?.addEventListener('click', function () {
    //});
}


async function updateCartItemQuantity(cartItemId, productId, count) {
    const cartItemElement = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
    if (!cartItemElement) return;

    const quantityElement = cartItemElement.querySelector('.quantity');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + count; //текущее количество + 1 или -1
    if (newQuantity < 1) { //удалить из корзины товар если его количество становится 0
        await removeCartItem(cartItemId, productId);
        return;
    }
    try {
        const response = await fetch(`https://localhost:5001/cart/item/update/${cartItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ProductQuantity: newQuantity })
        });

        if (!response.ok) return;

        quantityElement.textContent = newQuantity;
        const price = parseInt(cartItemElement.querySelector('.product-total').textContent) / currentQuantity;
        cartItemElement.querySelector('.product-total').textContent = `${(price * newQuantity)} руб.`;
        updateTotalSum();
    } catch (error) {
        console.error('Ошибка:', error);
        quantityElement.textContent = currentQuantity;
        return;
    }
}

async function removeCartItem(cartItemId, productId) {
    try {
        const cartItemElement = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (!cartItemElement) return;
        const targetId = userId || sessionId;
        if (!targetId) return;

        const response = await fetch(`https://localhost:5001/cart/${targetId}/item/${cartItemId}`, {
            method: 'DELETE',  
            headers: { 'Content-Type': 'application/json' } 
        });

        if (!response.ok) return;
        cartItemElement.remove(); //из дом удаляем
        updateTotalSum();

        const container = document.getElementById('cart-container'); //если в корзине не осталось элементов
        if (container.querySelectorAll('.cart-item').length === 0) {
            container.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        }
    }
    catch (error) {
        console.error('Ошибка:', error);
        return;
    }
}

function updateTotalSum() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const itemTotal = parseInt(item.querySelector('.product-total').textContent);
        total += itemTotal;
    });
    document.querySelector('.total-sum').textContent = `${total} руб.`;
}