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
            <button class="buy-button" data-id="${product.productId}" data-quantity="${product.availableQuantity}">
            <span class="button-text">Добавить в корзину</span>
            <span class="button-counter" id="id-${product.productId}"></span>
            </button>
        </div>
    `).join('');

     document.querySelectorAll('.buy-button').forEach(button => {
         button.addEventListener('click', function (event) {
             const productId = this.dataset.id;
             const productQuan = parseInt(this.dataset.quantity);
             addToCart.call(this, event, productId, productQuan); 
         });
     });
}

let globalCartItemsCount = 0; //общее количество товаров
let cartItemsCount = {}; //для каждого товара отдельно / ключ - айди продукта, значение - количество в корзине
function addToCart(event, productId, productQuan) {
    const clickedButton = event.target;  //при нажатии на кпопку добавить в корзину меняется цвет и надпись

    clickedButton.querySelector('.button-text').textContent = "Добавлено в корзину";
    clickedButton.style.backgroundColor = '#7e9682'; // Зеленый цвет

    globalCartItemsCount++;
    if (!cartItemsCount[productId]) {
        cartItemsCount[productId] = 0;
    }
    cartItemsCount[productId]++;
    if (cartItemsCount[productId] >= productQuan) { //если количество товара добавленного превышает доступное
        clickedButton.disabled = true;//заблокировать дальнейшее добавление товара в корзину
    }

    updateProductCounter(productId, productQuan);
    updateCartCounter();
}

function updateProductCounter(productId, productQuan) {
    const counter = document.getElementById(`id-${productId}`);
    if (!counter) return;

    if (cartItemsCount[productId] > 0) {
        counter.textContent = cartItemsCount[productId];
        counter.style.display = 'block';
    }
    else {
        counter.style.display = 'none';
    }
}

function updateCartCounter() {
    const globCounter = document.getElementById('cart-counter');
    if (!globCounter) return;

    if (globalCartItemsCount > 0) {
        globCounter.textContent = globalCartItemsCount;
        globCounter.style.display = 'block'; //видимый счетчик

    } else {
        globCounter.style.display = 'none'; //невидимый счетчик
    }
}