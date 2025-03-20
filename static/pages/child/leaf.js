// Отримання імені поточної сторінки з URL
let page = location.pathname.split("/").pop();

// Встановлюємо який символ буде відображатися
let simbol = "🪙";

// Початкові значення координат та інші параметри
let x1 = 0;
let y1 = 0;
const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window,
    innerHeight || 0
);
let dist_to_draw = 50;
let delay = 1000;
let fsize = ["1.1rem", "1.4rem", "0.8rem", "1.7rem"];

// Функція для генерації випадкового числа в заданому діапазоні
let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Функція для вибору випадкового елемента з масиву
let selRand = (o) => o[rand(0, o.length - 1)];

// Функція для обчислення відстані між двома точками
let distanceTo = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

// Перевірка, чи має відбуватися анімація для даної позиції миші
let shouldDraw = (x, y) => distanceTo(x1, y1, x, y) >= dist_to_draw;

// Функція для додавання листочка на сторінку
let addLeaf = (x, y) => {
    const leaf = document.createElement("div");
    leaf.innerHTML = simbol;
    leaf.className = "leaf";
    leaf.style.top = `${y + rand(-20, 20)}px`;
    leaf.style.left = `${x}px`;
    leaf.style.fontSize = selRand(fsize);
    leaf.style.transformStyle = "preserve-3d";
    leaf.style.width = "1px";
    leaf.style.height = "1px";
    leaf.style.position = "fixed";
    document.body.appendChild(leaf);

    // Анімація для руху та зникнення листочка
    const fs = 10 + 5 * parseFloat(getComputedStyle(leaf).fontSize);
    leaf.animate(
        {
            translate: `0 ${y + fs > vh ? vh - y : fs}px`,
            opacity: 0,
            transform: `rotateX(${rand(1, 500)}deg) rotateY(${rand(
                1,
                500
            )}deg)`,
        },
        {
            duration: delay,
            fill: "forwards",
        }
    );

    // Після анімації видалення листочка зі сторінки
    setTimeout(() => {
        leaf.remove();
    }, delay);
};

// Обробник події руху миші
document.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    if (shouldDraw(clientX, clientY)) {
        // Додавання листочка та оновлення координат
        addLeaf(clientX, clientY);
        x1 = clientX;
        y1 = clientY;
    }
});