﻿export let sessionId = null;
export let userId = null;
export let authInfo = { isAuthenticated: false, userId: null };
export let globalCartItemsCount = 0;
export let cartItemsCount = {};
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const storedAuthInfo = localStorage.getItem('authInfo');
        if (storedAuthInfo) {
            authInfo = JSON.parse(storedAuthInfo);
            userId = authInfo.userId;
        }

        console.log('auth state:', authInfo);

        if (authInfo.isAuthenticated) {
            await updateCartStateAuth(authInfo.userId);
        } 

        await loadPage();
        loadCartState();
        if (window.location.pathname === '/bookstore.html') {
            getAllProducts();
        }

    } catch (error) {
        console.error('Ошибка:', error);
    }
});


export async function updateCartStateAuth(userId) {
    try {
        const cartResponse = await fetch(`https://localhost:5001/cart/user/${userId}`);
        if (!cartResponse.ok) throw new Error('Ошибка получения корзины пользователя');
        const cartId = await cartResponse.json();
        const contentResponse = await fetch(`https://localhost:5001/cart/${cartId}`);
        if (!contentResponse.ok) throw new Error('Ошибка получения содержимого корзины');

        const cartContent = await contentResponse.json();     
        const items = cartContent.cartItems;  
        globalCartItemsCount = items.length;

        const cartItems = {};
        items.forEach(item => {
            if (item.productId) {
                cartItems[item.productId] = item.productQuantity || 1;
            }
        });
        cartItemsCount = cartItems;
        saveCartState();
        updateCartCounter();     
    }
    catch (error) {
        console.error('Ошибка', error);
    }
}

export function updateCartCounter() {
    const globCounter = document.getElementById('cart-counter');
    if (!globCounter) return;

    if (globalCartItemsCount > 0) {
        globCounter.textContent = globalCartItemsCount;
        globCounter.style.display = 'block'; //видимый счетчик

    } else {
        globCounter.style.display = 'none'; //невидимый счетчик
    }
}
export function loadCartState() {
    const savedCart = localStorage.getItem('cartState');
    if (savedCart) {
        const parsed = JSON.parse(savedCart);
        globalCartItemsCount = parsed.globalCount || 0;
        cartItemsCount = parsed.items || {};
    }
    updateCartCounter();
}
export function saveCartState() {
    localStorage.setItem('cartState', JSON.stringify({
        globalCount: globalCartItemsCount,
        items: cartItemsCount
    }));
}

export function setAuth(userId) {
    authInfo = {
        isAuthenticated: true,  
        userId: userId
    };
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
    localStorage.setItem('userId', userId);
    console.log('Auth updated:', authInfo);
}

export function setGlobalCount(glob) { 
    globalCartItemsCount = glob;
}

function generateSessionId() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}


export async function loadPage() {
    try {
       // authInfo = localStorage.getItem('authInfo');
        if (!authInfo.isAuthenticated) {
            sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = generateSessionId();
                localStorage.setItem('sessionId', sessionId);
                await createNewCart(sessionId);
            }
        }
        else if (authInfo.userId) {
            userId = authInfo.userId;
            localStorage.setItem('userId', userId);
        }
    } catch (error) {
        console.error('Ошибка при загрузке страницы:', error);
        throw error;
    }
}



export async function registerUser(userData) {
    console.log('user data', userData);
    const response = await fetch('https://localhost:5001/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const user = await fetch(`https://localhost:5001/user/check-phone/${encodeURIComponent(userData.phone)}`)
    const resp = await user.json();
    console.log('user data', resp);
    setAuth(resp.userId);

    console.log('authinfo', authInfo);
    return await response.json();
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

export function renderProducts(products) {
    const container = document.querySelector('.products-container'); 
    container.innerHTML += products.map(product => {
            const isInCart = cartItemsCount[product.productId] > 0;
            const isDisabled = isInCart || product.availableQuantity <= 0;

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
                    ${isDisabled ? 'disabled' : ''}>
                <span class="button-text">
                    ${isInCart ? 'Добавлено в корзину' :
                    product.availableQuantity <= 0 ? 'Нет в наличии' : 'Добавить в корзину'}
                </span>
            </button>
        </div>`;
        }).join('');

        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', async function (event) {
                const productId = this.dataset.id;
                const productQuan = parseInt(this.dataset.quantity);
                addToCart.call(this, event, productId, productQuan);
            });
        });
}

export async function addToCart(event, productId, productQuan) {
    try {  
        const clickedButton = event.currentTarget;
        clickedButton.querySelector('.button-text').textContent = "Добавлено в корзину";
        clickedButton.style.backgroundColor = '#47a655';
        clickedButton.disabled = true;

        globalCartItemsCount++;
        if (!cartItemsCount[productId]) {
            cartItemsCount[productId] = 0;
        }
        cartItemsCount[productId]++;

        updateCartCounter();
        saveCartState();

        const cartItemRequest = {
            Item: {
                ProductId: productId,
                ProductQuantity: cartItemsCount[productId],
            },
            Auth: authInfo.isAuthenticated
        };

        

        if (authInfo.isAuthenticated) {
            const response = await fetch(`https://localhost:5001/cart/${userId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(cartItemRequest)
            });
            if (!response.ok) throw new Error(await response.text());
        } else {
            const response = await fetch(`https://localhost:5001/cart/${sessionId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItemRequest)
            });
            if (!response.ok) throw new Error(await response.text());
        }

    } catch (error) {
        console.error('Ошибка:', error);
    }
}



export function updateProductCounter(productId, productQuan) {
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

async function createNewCart(sessionId) {
    try {
        const response = await fetch(`https://localhost:5001/cart/create/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ sessionId: sessionId })
        });
        if (!response.ok) throw new Error('Ошибка создания корзины');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export async function logout() { //сброс всех значений при выходе из профиля
    try {
        authInfo = { isAuthenticated: false, userId: null };
        localStorage.removeItem('authInfo');
        localStorage.removeItem('userId');

        sessionId = generateSessionId();
        localStorage.setItem('sessionId', sessionId);
        await createNewCart(sessionId);

        cartItemsCount = {};
        globalCartItemsCount = 0;
        localStorage.removeItem('cartState');


    } catch (error) {
        console.error('Ошибка:', error);
       // window.location.href = 'bookstore.html'; 
    }
}


window.onbeforeunload = function () {
    authInfo = { isAuthenticated: false, userId: null };
    sessionStorage.removeItem('authChecked');
   //localStorage.clear();
};


//export async function checkAuth() {
//    try {
//        const response = await fetch('https://localhost:5001/user/is-auth');
//        const data = await response.json();
//        return data;
//    } catch (error) {
//        console.error('Ошибка при проверке авторизации:', error);
//        return { isAuthenticated: false, userId: null };
//    }
//}