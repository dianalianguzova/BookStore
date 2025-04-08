
//надо как-то убирать дублирование тут 
document.addEventListener('DOMContentLoaded', function () {
    loadPage();
    loadCartState();
    const urlParams = new URLSearchParams(window.location.search); //ищет параметры в юрл
    const categoryId = urlParams.get('categoryId');
    if (categoryId) {
        getProductsByCategory(categoryId);
    }
    getAllCategories();
});

let auth = null;
function loadPage() {
    auth = checkAuth();
    if (!auth.isAuthenticated) {
        sessionId = localStorage.getItem('sessionId');
    }
    else {
        userId = localStorage.getItem('userId');
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


let categoriesMap = {}; //названия категорий
async function getAllCategories() { //получить категории для выпадающего списка
    const dropdown = document.getElementById('categories-dropdown');
    try {
        const response = await fetch('https://localhost:5001/categories');
        if (!response.ok) throw new Error('Ошибка загрузки категорий');
        const data = await response.json();
        categoriesMap = data.categories.reduce((map, category) => {
            map[category.category_id] = category.name; 
            return map;
        }, {});
        renderCategories(data.categories);

    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function renderCategories(categories) { //список
    const dropdown = document.getElementById('categories-dropdown');
    if (!categories || categories.length === 0) {
        dropdown.innerHTML = '<li>Категории не найдены</li>';
        return;
    }
    dropdown.innerHTML = categories.map(category => `<li> 
    <a href="categories.html?categoryId=${category.category_id}" class="category-link">
                ${categoriesMap[category.category_id]}   </a>
        </li>`).join('');
}

const container = document.querySelector('.products-container');
async function getProductsByCategory(category_id) { //получить все продукты по категории
    try {
        const response = await fetch(`https://localhost:5001/categories/${category_id}`);
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        const data = await response.json();
        const categoryName = categoriesMap[category_id];
        container.innerHTML = `<h2>${categoryName}</h2>`; 
        renderProducts(data.bookProducts); 
    } catch (error) {
        console.error('Ошибка:', error);
        container.innerHTML = '<div class="error">Ошибка загрузки товаров</div>';
    }
}

function renderProducts(products) {
    const productsHTML = products.map(product => {
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

    container.insertAdjacentHTML('beforeend', productsHTML); //чтобы в хтмл добавлялись данные, а не перезаписывали док

    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', async function (event) {
            const productId = this.dataset.id;
            const productQuan = parseInt(this.dataset.quantity);
            addToCart.call(this, event, productId, productQuan);
        });
    });
}

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
        if (auth.isAuthenticated) {
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
            console.log('Товар добавлен в корзину');
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