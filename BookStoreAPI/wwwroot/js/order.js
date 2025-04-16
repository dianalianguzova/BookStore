import { getCartItems } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    console.log(authInfo);
    await loadUserData(authInfo.userId);

    await loadOrderItems(authInfo.userId);

    document.getElementById('confirm-order-btn').addEventListener('click', async () => {
        await submitOrder(authInfo.userId);
    });
});

async function loadUserData(userId) {
    try {
        const response = await fetch(`https://localhost:5001/user/${userId}`);
        if (response.ok) {
            const user = await response.json();
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-surname').textContent = user.surname;
            document.getElementById('user-phone').textContent = user.phone;
            document.getElementById('user-address').textContent = user.deliveryAddress;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
    }
}

async function loadOrderItems(userId) {
    try {
        const cartContent = await getCartItems(userId);
        const container = document.getElementById('order-items-container');
        let total = 0;

        if (!cartContent || cartContent.length === 0) {
            container.innerHTML = '<p>Ваша корзина пуста</p>';
            return;
        }

        let html = '';

        for (const item of cartContent) {
            const productResponse = await fetch(`https://localhost:5001/product/${item.productId}`);
            const product = await productResponse.json();


            const itemTotal = product.price * item.productQuantity;
            total += itemTotal;

            html += `<div class="order-item">
                     <div class="item-name">${'"' + product.name + '"'}<br>${product.author}</div>
                    <div class="item-quantity">${item.productQuantity} шт.</div>
                    <div class="item-price">${itemTotal} руб.</div>
                </div>`;
        }

        container.innerHTML = html;
        document.getElementById('order-total-amount').textContent = `${total} руб.`;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function submitOrder(userId) {
    try {
        const response = await fetch('https://localhost:5001/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: userId.toString() 
        });

        if (response.ok) {
            const order = await response.json();
            alert('Заказ успешно оформлен! Номер вашего заказа: ' + order.order_id);
            window.location.href = 'bookstore.html';
        } 
    } catch (error) {
        console.error('Ошибка:', error);
    }
}