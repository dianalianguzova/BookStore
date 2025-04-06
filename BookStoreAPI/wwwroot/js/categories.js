document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search); //ищет параметры в юрл
    const categoryId = urlParams.get('categoryId');
    if (categoryId) {
        getProductsByCategory(categoryId);
    }
    getAllCategories();
});

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
    const productsHTML = products.map(product => `<div class="product-card">
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
    container.insertAdjacentHTML('beforeend', productsHTML); //чтобы в хтмл добавлялись данные, а не перезаписывали док
    //document.querySelectorAll('.buy-button').forEach(button => {
    //    button.addEventListener('click', function () {
    //        addToCart(this.dataset.id);
    //    });
    //});
}