import { setAuth } from './bookstore.js';

document.addEventListener('DOMContentLoaded', function () {
    const codeInputs = document.querySelectorAll('.code-input');
    const verifyBtn = document.getElementById('verify-code-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (codeInputs.length && verifyBtn) {
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', function () { //переход на след поле
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });

        verifyBtn.addEventListener('click', async function () {
            const code = Array.from(codeInputs).map(input => input.value).join('');
            if (code.length !== 4)  return;         
            try {
                setAuth(id);
                window.location.href = 'auth.html';
            } catch (error) {
                showError('Ошибка при проверке кода');
                console.error('Ошибка:', error);
            }
        });
    }
});