// Зберігаємо активну форму
let activeForm = "login";

// зберігаємо форми в змінні
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const childrenForm = document.querySelector("#children-form");

// зберігаємо кнопки
const loginButton = document.querySelector("#login-button");
const registerButton = document.querySelector("#register-button");
const childrenButton = document.querySelector("#children-button");

/*
 * Функція яка перемикає форми авторизації, логіну та форми для дитини
*/

const switchForm = (form) => {
    //зберігаємо активну форму
    activeForm = form;

    //перемикаємо форми
    loginForm.style.display = form === "login" ? "block" : "none";
    registerForm.style.display = form === "register" ? "block" : "none";
    childrenForm.style.display = form === "children" ? "block" : "none";

    //перемикаємо кнопки
    loginButton.disabled = form === "login" ? "none" : "block";
    registerButton.style.display = form === "register" ? "none" : "block";
    childrenButton.style.display = form === "children" ? "none" : "block";
};

// спершу вмикаємо форму логіну
switchForm("login");