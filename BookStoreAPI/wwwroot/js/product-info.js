import { addToCart, loadPage, loadCartState, cartItemsCount } from './bookstore.js';
document.addEventListener('DOMContentLoaded', function () {
    loadPage();
    loadCartState();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-info-container');
    if (!productId) return; 
    
    getProductInfo(productId);
});

async function getProductInfo(productId) {
    try {
        const response = await fetch(`https://localhost:5001/product/${productId}`);
        if (!response.ok) throw new Error('Информация о продукте не найдена');
        const book = await response.json();
        renderProductInfo(book);
    } catch (error) {
        window.location.href = 'https://localhost:5001/error.html';
        console.error('Ошибка:', error);
    }
}

function renderProductInfo(product) {
    const isInCart = cartItemsCount[product.productId] > 0;
    const container = document.getElementById('product-info-container');
    container.innerHTML = `<div class="product-image-block">
                <div class="image-container">
                    <img src="${product.image || 'https://via.placeholder.com/250x350?text=No+Image'}" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/250x350?text=No+Image'">
                </div>
                <div class="product-title">
                    <h2 class="name">${product.name}</h2>
                    <p class="author">${product.author}</p>
                </div>
            </div>
            
            <div class="description-block">
                <div class="description">
                    <h3>Описание</h3>
                    <p>${product.description || 'Описание отсутствует'}</p>
                </div>
            </div>
            
            <div class="price-block">
                <p class="price">${product.price} руб.</p>
              <button class="buy-button ${isInCart ? 'added' : ''}" 
                    data-id="${product.productId}" 
                    data-quantity="${product.availableQuantity}"
                    ${isInCart ? 'disabled' : ''}>
                <span class="button-text">
                    ${isInCart ? 'Добавлено в корзину' : 'Добавить в корзину'}
                </span>
                <span class="button-counter" id="id-${product.productId}"></span>
            </button>
            </div>
        </div>`;

    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', async function (event) {
            const productId = this.dataset.id;
            const productQuan = parseInt(this.dataset.quantity);
            addToCart.call(this, event, productId, productQuan);
        });
    });
}