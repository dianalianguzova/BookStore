document.addEventListener('DOMContentLoaded', async () => {
    try {
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        await getAllOrders(authInfo.userId);
    }
    catch (error) {
        window.location.href = 'error.html';
        console.error('Ошибка', error);
    }
});

async function getAllOrders(userId) {
    try {
        const response = await fetch(`https://localhost:5001/user/${userId}/orders`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderOrders(data);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function renderOrders(orders) {
    const container = document.getElementById('orders-list');
    if (!container) return;

    if (!orders || orders.length === 0) {
        container.innerHTML = '<div class="empty-orders">Заказов еще нет:(</div>';

        return;
    }

    let html = '';
    for (const order of orders) {
        const orderDate = new Date(order.date).toLocaleDateString('ru-RU');
        let itemsHtml = '';

            const items = order.orderItems.map(async (item) => {
                try {
                    const response = await fetch(`https://localhost:5001/product/${item.productId}`);
                    if (!response.ok) throw new Error('Ошибка загрузки товара');
                    const product = await response.json();
                    return `<div class="order-item">
                              <span>${'"' + product.name + '"'}<br>${product.author}</span>
                              <span>${item.productQuantity} шт.</span>
                        </div>`;
                } catch (error) {
                    console.error("Ошибка", error);
                }
            });

            const itemResults = await Promise.all(items);
            itemsHtml = itemResults.join('');
        html += `<div class="order-card">
                <div class="order-header">
                    <span class="order-id">Заказ #${order.order_id}</span>
                    <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-details">
                    <div class="order-date">Дата: ${orderDate}</div>
                    <div class="order-address">Адрес: ${order.deliveryAddress}</div>
                    <div class="order-items-list">
                        ${itemsHtml}
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}
