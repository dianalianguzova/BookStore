import { cartItemsCount, globalCartItemsCount, registerUser,authInfo,setAuth, logout, deleteUser } from './bookstore.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        if (authInfo.isAuthenticated) {
            console.log(authInfo);
            showProfile(authInfo.userId);
        } else {
            showMailForm();
        }
    }
    catch (error) {
        console.error('Ошибка:', error);
    }
});

const registerForm = document.getElementById('register-form');
const profileSection = document.getElementById('profile-section');
const updateProfile = document.getElementById('update-profile');
const mailForm = document.getElementById('mail-form');

function showMailForm() {
    mailForm.style.display = 'block';
    registerForm.style.display = 'none';
    profileSection.style.display = 'none';
    updateProfile.style.display = 'none';

    const checkMailBtn = document.getElementById('check-mail-btn');
    const mailInput = document.getElementById('mail');
    checkMailBtn.addEventListener('click', function () {
        const mailValue = mailInput.value.trim();
        const mailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!mailRegex.test(mailValue)) {
            return;
        }
        checkMail();
    });
}

async function checkMail() {
    const mail = document.getElementById('mail').value;
    try {
        const response = await fetch(`https://localhost:5001/user/check-mail/${(mail)}`);
        if (response.ok) {
            const data = await response.json();
            //if (data.isDeleted) {

            //}
            //else {
                window.location.href = `checkCode.html?id=${data.userId}`;
                showProfile(data.userId);
          //  }
        }
        else if (response.status == 404) { //нет в системе - попросить зарегестрироваться
            showRegisterForm();
        }
    } catch (error) {
        window.location.href = 'https://localhost:5001/error.html';
        console.error('Ошибка:', error);
    }
}

function showRegisterForm() {
    phoneForm.style.display = 'none';
    updateProfile.style.display = 'none';
    registerForm.style.display = 'block';

    document.getElementById('register-btn').addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name) return;
        if (!surname) return;
        if (!email) return;
        if (!address) return;
        if (!phone) return;

        const phoneRegex = /^\+7[0-9]{10}$/;
        const nameRegex = /^[A-ZА-Я][a-zа-я]*$/;
        const surnameRegex = /^[A-ZА-Я][a-zа-я]*$/;
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!nameRegex.test(name))  return;   
        if (!surnameRegex.test(surname)) return;
        if (!emailRegex.test(email)) return;
        if (!phoneRegex.test(phone)) return;

        const userData = {
            phone: phone,
            name: name,
            surname: surname,
            email: email,
            deliveryAddress: address
        };
        registerNewUser(userData);
    });
}
async function registerNewUser(userData) {
    try {
        const user = await registerUser(userData);
        showProfile(user.userId);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
 async function showProfile(userId) {
    try {
        const response = await fetch(`/user/${userId}`);
        const user = await response.json();

        document.getElementById('user-info').innerHTML = `<div class="info-item">
                <span class="info-label">Имя</span>
                <span class="info-value">${user.name + ' ' + user.surname}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${user.email}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Телефон</span>
                <span class="info-value">${user.phone}</span>
            </div>
             <div class="info-item">
                <span class="info-label">Адрес</span>
                <span class="info-value">${user.deliveryAddress}</span>
            </div>`;

        mailForm.style.display = 'none';
        registerForm.style.display = 'none';
        profileSection.style.display = 'block';
        updateProfile.style.display = 'none';

        document.getElementById('edit-profile').addEventListener('click', function () { //изменить профиль
            document.getElementById('update-name').value = user.name || '';
            document.getElementById('update-surname').value = user.surname || '';
            document.getElementById('update-email').value = user.email || '';
            document.getElementById('update-address').value = user.deliveryAddress || '';

            mailForm.style.display = 'none';
            registerForm.style.display = 'none';
            profileSection.style.display = 'none';
            updateProfile.style.display = 'block';
        });

        document.getElementById('update-btn').addEventListener('click', async function () {
            await updateUser(userId);

        });

        document.getElementById('logout-btn').addEventListener('click', async (e) => { //выйти из профиля
            e.preventDefault();
            await logout();
            window.location.href = 'bookstore.html';

        });
        document.getElementById('delete').addEventListener('click', async function () { //удалить профиль
            await deleteUser(userId);
            window.location.href = 'bookstore.html';
        });


    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
    }
}

async function updateUser(userId) {
    try {
        const name = document.getElementById('update-name').value.trim();
        const surname = document.getElementById('update-surname').value.trim();
        const email = document.getElementById('update-email').value.trim();
        const address = document.getElementById('update-address').value.trim();

        if (!name) return;
        if (!surname) return;
        if (!email) return;
        if (!address) return;

        const nameRegex = /^[A-ZА-Я][a-zа-я]*$/;
        const surnameRegex = /^[A-ZА-Я][a-zа-я]*$/;
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!nameRegex.test(name)) return;
        if (!surnameRegex.test(surname)) return;
        if (!emailRegex.test(email)) return;

        const updatedData = {
            name,
            surname: surname, 
            email,
            deliveryAddress: address
        };

        const response = await fetch(`https://localhost:5001/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) return;
        await showProfile(userId);

    } catch (error) {
        console.error('Ошибка:', error);
    }
}