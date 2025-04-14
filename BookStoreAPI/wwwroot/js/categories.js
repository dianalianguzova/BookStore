import { cartItemsCount, loadCartState, updateCartCounter, renderProducts, globalCartItemsCount } from './bookstore.js';

const container = document.querySelector('.products-container');
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search); //ищет параметры в юрл 
    const categoryId = urlParams.get('categoryId');
    if (categoryId) getProductsByCategory(categoryId);

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
    }
}

