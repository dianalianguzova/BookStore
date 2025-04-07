document.addEventListener('DOMContentLoaded', function () {
    getAllProducts();
});
async function checkAuth() {
    try {
        const response = await fetch('https://localhost:5001/user/is-auth', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        return { isAuthenticated: false, userId: null }; 
    }
}

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
         button.addEventListener('click',async  function (event) {
             const productId = this.dataset.id;
             const productQuan = parseInt(this.dataset.quantity);
             addToCart.call(this, event, productId, productQuan); 
         });
     });
}

let globalCartItemsCount = 0; //общее количество товаров
let cartItemsCount = {}; //для каждого товара отдельно / ключ - айди продукта, значение - количество в корзине
let sessionId = null;
async function addToCart(event, productId, productQuan) {
    const clickedButton = event.currentTarget;  //при нажатии на кпопку добавить в корзину меняется цвет и надпись

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

    const cartItem = {
        ProductId: productId,
        ProductQuantity: cartItemsCount[productId] 
    };
    try {
        const authInfo = await checkAuth(); 
        if (authInfo.isAuthenticated) {
            const userId = authInfo.userId;
            const response = await fetch(`https://localhost:5001/cart/${userId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(cartItem)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }
        } else {
            if (!sessionId)  sessionId = Math.floor(10000000 + Math.random() * 90000000).toString(); //сессионный ID
         
            const response = await fetch(`https://localhost:5001/cart/${sessionId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItem)
            });
            if (!response.ok) throw new Error(await response.text());
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
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