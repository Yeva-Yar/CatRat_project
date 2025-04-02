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
    loginButton.style.display  = form === "login" ? "none" : "block";
    registerButton.style.display = form === "register" ? "none" : "block";
    childrenButton.style.display = form === "children" ? "none" : "block";
    
    loginButton.style.order = form === "children" ? "5" : "2";
};

// спершу вмикаємо форму логіну
switchForm("login");

document.querySelector("#register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    e.target.reset();
    let obj = {
        name: data.get("name"),
        surname: data.get("surname"),
        login: data.get("login"),
        password: data.get("password"),
        password2: data.get("password2"),
    };
    if (obj.password !== obj.password2) {
        alertify.alert("Паролі не співпадають");
        return;
    }
    let body = JSON.stringify({
        name: obj.name,
        surname: obj.surname,
        login: obj.login,
        password: obj.password
    });
    fetch("/api/register", {
        method: "POST",
        body,
    }).then((res) => {
        if (res.ok) {
            switchForm("login");
        }
    });
})

document.querySelector("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    e.target.reset();
    let body = {
        login: data.get("login"),
        password: data.get("password"),
    };
    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(body),
    }).then((res) => res.json()).then((data) => {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/`;
        window.location.assign("/")
    });
})

document.querySelector("#children-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    e.target.reset();
    let body = JSON.stringify({
        code: data.get("login"),
    });
    fetch("/api/childLogin", {
        method: "POST",
        body,
    }).then((res) => res.json()).then((d) => {
        if(d.message) {
            alertify.alert(d.message);
        }
        else if(d.status = "ok") {
            document.cookie = `token=${data.get("login")}; path=/`;
            window.location.assign("/")
        }
    });
})