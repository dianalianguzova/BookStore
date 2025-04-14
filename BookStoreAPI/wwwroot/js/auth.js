import { cartItemsCount, globalCartItemsCount, registerUser,authInfo,setAuth, setGlobalCount, loadCartState, logout, updateCartCounter } from './bookstore.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        if (authInfo.isAuthenticated) {
            showProfile(authInfo.userId);
        } else {
            showPhoneForm();
        }
    }
    catch (error) {
        window.location.href = 'https://localhost:5001/error.html';
        console.error('Ошибка:', error);
    }
});

const phoneForm = document.getElementById('phone-form');
const registerForm = document.getElementById('register-form');
const profileSection = document.getElementById('profile-section');

function showPhoneForm() {
    phoneForm.style.display = 'block';
    registerForm.style.display = 'none';
    profileSection.style.display = 'none';
    document.getElementById('check-phone-btn').addEventListener('click', checkPhone);
}

async function checkPhone() {
    const phone = document.getElementById('phone').value;
    try {
        const response = await fetch(`https://localhost:5001/user/check-phone/${encodeURIComponent(phone)}`);
        if (response.ok) { //если есть в системе, то показать профиль
            const data = await response.json();
            setAuth(true, data.userId);
            showProfile(data.userId);
        }
        else if (response.status == 404) { //нет в системе - попросить зарегестрироваться
            showRegisterForm(phone);
        }
    } catch (error) {
        window.location.href = 'https://localhost:5001/error.html';
        console.error('Ошибка:', error);
    }
}

function showRegisterForm(phone) {
    phoneForm.style.display = 'none';
    registerForm.style.display = 'block';

    document.getElementById('register-btn').addEventListener('click', () => registerNewUser(phone));
}

async function registerNewUser(phone) {
    const userData = {
        phone: phone,
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        email: document.getElementById('email').value,
        deliveryAddress: document.getElementById('address').value
    };

    try {
        const user = await registerUser(userData);
    //    setAuth(true, data.userId);
        showProfile(user.userId);
    } catch (error) {
        console.error('Ошибка регистрации:', error);
    }
}

async function showProfile(userId) {
    try {
        const response = await fetch(`/user/${userId}`);
        const user = await response.json();

        document.getElementById('user-info').innerHTML = `<div class="info-item">
                <span class="info-label">Имя:</span>
                <span class="info-value">${user.name + ' ' + user.surname|| 'Не указано'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email || 'Не указан'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Телефон:</span>
                <span class="info-value">${user.phone || 'Не указан'}</span>
            </div>`;

        phoneForm.style.display = 'none';
        registerForm.style.display = 'none';
        profileSection.style.display = 'block';

        document.getElementById('logout-btn').addEventListener('click', async (e) => { //выйти из профиля
            e.preventDefault();
            await logout();
            window.location.href = 'bookstore.html'; 
        });

        document.getElementById('edit-profile-btn').addEventListener('click', function () { //изменить профиль

        });


    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
    }
}