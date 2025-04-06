document.addEventListener('DOMContentLoaded', function () {
    getAllProducts();
});

async function getAllProducts() {
    try {
        const response = await fetch('https://localhost:5001/');
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        const data = await response.json();
        const products = data.bookProducts;
        renderProducts(products);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

 function renderProducts(products) {
    const container = document.querySelector('.products-container');
    container.innerHTML = products.map(product => `<div class="product-card">
            <img class="image" 
                 src="${product.image || 'https://avatanplus.com/files/resources/original/5968a2c8f2ed115d40bbe123.png'}" 
                 alt="${product.name}"
                 onerror="this.src='https://avatanplus.com/files/resources/original/5968a2c8f2ed115d40bbe123.png'">
            <a href="product-info.html?id=${product.productId}" class="name-link">
                <div class="name">${product.name}</div>
            </a> 
            <div class="author">${product.author}</div>
            <div class="price">${product.price} руб.</div>
            <button class="buy-button" data-id="${product.productId}">
                Добавить в корзину
            </button>
        </div>
    `).join('');

 //   document.querySelectorAll('.buy-button').forEach(button => {
    //    button.addEventListener('click', function () {addToCart(this.dataset.id);});
   // });
}
//function addToCart(productId) {

//}