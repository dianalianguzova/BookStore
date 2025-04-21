import { cartItemsCount, userId, sessionId,globalCartItemsCount, authInfo, setGlobalCount, saveCartState} from './bookstore.js';

document.addEventListener('DOMContentLoaded', function () {
    try {
        getCartProducts();
    }
    catch (error) {
        window.location.href = 'error.html';
        console.error("Ошибка", error);
    }
});

async function getCartProducts() {
    const userId = localStorage.getItem('userId');
    const sessionId = localStorage.getItem('sessionId');
    let cartContent = null;
    try {
        let cartId;
        if (userId) {
            const cartResponse = await fetch(`https://localhost:5001/cart/user/${userId}`);
            if (!cartResponse.ok) throw new Error('Ошибка получения корзины пользователя');
            cartId = await cartResponse.json();
        }
        else {
            const cartResponse = await fetch(`https://localhost:5001/cart/session/${sessionId}`);
            if (!cartResponse.ok) throw new Error('Ошибка получения сессионной корзины');
           cartId = await cartResponse.json();
        }

        const contentResponse = await fetch(`https://localhost:5001/cart/${cartId}`);
        if (!contentResponse.ok) throw new Error('Ошибка получения содержимого корзины');

        cartContent = await contentResponse.json();

    } catch (error) {
        console.error('Ошибка:', error);
        return;
    }
    renderProducts(cartContent);
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
            setGlobalCount(globalCartItemsCount - quantityToRemove); //удаляем из глобального счетчика столько, сколько товара было в корзине
            await removeCartItem(cartItemId, productId);
            saveCartState();
        });
        
    });

    document.querySelectorAll('.order-btn').forEach(btn => { //сделать заказ
        btn.addEventListener('click', async function () {
            await makeOrder();
        });
    });
}

async function makeOrder() {
    try {
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        if (authInfo?.isAuthenticated) {
            window.location.href = 'order.html';
        } else {
            window.location.href = 'auth.html';
        }
    }
    catch (error) {
        console.error("Ошибка", error);
    }
}

export async function getCartItems(userId) {
    const cartResponse = await fetch(`https://localhost:5001/cart/user/${userId}`);
    if (!cartResponse.ok) throw new Error('Ошибка получения корзины пользователя');
    const cartId = await cartResponse.json();

    const contentResponse = await fetch(`https://localhost:5001/cart/${cartId}`);
    if (!contentResponse.ok) throw new Error('Ошибка получения содержимого корзины');

    const cartContent = await contentResponse.json();
    return cartContent.cartItems;
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
            headers: { 'Content-Type': 'application/json' } ,
            body: JSON.stringify({
                isAuthenticated: authInfo.isAuthenticated
            })
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