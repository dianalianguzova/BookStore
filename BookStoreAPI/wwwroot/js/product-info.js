document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-info-container');
    if (!productId) {
        return; //сделать надпись об ошибке
    }
    getProductInfo(productId);
});

async function getProductInfo(productId) {
    try {
        const response = await fetch(`https://localhost:5001/product/${productId}`);
        if (!response.ok) throw new Error('Информация о продукте не найдена');
        const book = await response.json();
        renderProductInfo(book);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function renderProductInfo(product) {
    const container = document.getElementById('product-info-container');
    container.innerHTML = `<div class="product-info-container">
            <div class="product-image-block">
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
                <button class="buy-button" data-id="${product.productId}">
                    Добавить в корзину
                </button>
            </div>
        </div>`;
  //  document.querySelector('.buy-button').addEventListener('click', function () {
     //   addToCart(this.dataset.id);
   // });
}