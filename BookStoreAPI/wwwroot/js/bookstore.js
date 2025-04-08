document.addEventListener('DOMContentLoaded', function () {
    loadPage();
    getAllProducts();
    loadCartState(); 
});

function loadCartState() {
    const savedCart = localStorage.getItem('cartState');
    if (savedCart) {
        const parsed = JSON.parse(savedCart);
        globalCartItemsCount = parsed.globalCount || 0;
        cartItemsCount = parsed.items || {};
    }
    updateCartCounter();
}

function saveCartState() {
    localStorage.setItem('cartState', JSON.stringify({
        globalCount: globalCartItemsCount,
        items: cartItemsCount
    }));
}


let sessionId = null;
let userId = null;
let authInfo = null;
function loadPage() {
    authInfo = checkAuth();
    if (!authInfo.isAuthenticated) {
        sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = Math.floor(10000000 + Math.random() * 90000000).toString(); //сессионный ID
            localStorage.setItem('sessionId', sessionId);
            console.log('Новая корзина создана:');
            createNewCart(sessionId); //создание сессионной корзины
        }
    }
    else {
        userId = localStorage.getItem('userId');
        if (!userId) {
            userId = authInfo.userId;
            localStorage.setItem('userId', userId);
           
        }
    }
}

async function createNewCart(sessionId) {
    try {
        const response = await fetch(`https://localhost:5001/cart/create/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({ sessionId: sessionId})
        });  
        if (!response.ok)  throw new Error('Ошибка создания корзины');
        const result = await response.json();
        console.log('Новая корзина создана:', result);
        return result;
    } catch (error) {
        console.error('Ошибка при создании корзины:', error);
        throw error;
    }
}

async function checkAuth() {
    try {
        const response = await fetch('https://localhost:5001/user/is-auth', {
            method: 'GET',
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
     container.innerHTML = products.map(product => {
         const isInCart = cartItemsCount[product.productId] > 0;

         return `<div class="product-card">
            <img class="image" 
                 src="${product.image || '../images/plug.png'}" 
                 alt="${product.name}"
                 onerror="this.src='../images/plug.png'">
            <a href="product-info.html?id=${product.productId}" class="name-link">
                <div class="name">${product.name}</div>
            </a> 
            <div class="author">${product.author}</div>
            <div class="price">${product.price} руб.</div>
            <button class="buy-button ${isInCart ? 'added' : ''}" 
                    data-id="${product.productId}" 
                    data-quantity="${product.availableQuantity}"
                    ${isInCart ? 'disabled' : ''}>
                <span class="button-text">
                    ${isInCart ? 'Добавлено в корзину' : 'Добавить в корзину'}
                </span>
                <span class="button-counter" id="id-${product.productId}">
                    ${isInCart ? cartItemsCount[product.productId] : ''}
                </span>
            </button>
        </div>`;
     }).join('');

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
async function addToCart(event, productId, productQuan) {
    const clickedButton = event.currentTarget;  
    clickedButton.querySelector('.button-text').textContent = "Добавлено в корзину";
    clickedButton.style.backgroundColor = '#47a655'; 
    clickedButton.disabled = true;

    globalCartItemsCount++;
    if (!cartItemsCount[productId]) {
        cartItemsCount[productId] = 0;
    }
    cartItemsCount[productId]++;
  //  if (cartItemsCount[productId] >= productQuan) { //если количество товара добавленного превышает доступное
  //      clickedButton.disabled = true;//заблокировать дальнейшее добавление товара в корзину
  //  }

 //   updateProductCounter(productId, productQuan);
    updateCartCounter();
    saveCartState();
    const cartItem = {ProductId: productId, ProductQuantity: cartItemsCount[productId]};
    try {
        if (authInfo.isAuthenticated) {
            const response = await fetch(`https://localhost:5001/cart/${userId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(cartItem)
            });
            if (!response.ok) throw new Error(await response.text());
        } else {
            const response = await fetch(`https://localhost:5001/cart/${sessionId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItem)
            });
            if (!response.ok) throw new Error(await response.text());
        }
    } catch (error) {
        console.error('Ошибка:', error);
        saveCartState();
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