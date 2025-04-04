let tasks = [];

function getChildrenTasks() {
    fetch("/api/getchildrentasks", {
        method: "GET",
    })
        .then((res) => res.json())
        .then((data) => {
            tasks = data;
            let list = document.querySelector("#taskList");
            list.innerHTML = "";
            data.forEach((task) => {
                list.innerHTML += `
            <li class="block" onclick="openTask(${JSON.stringify(task.id)})">
            <h4>${task.task}</h4>
            <i class="fa-solid fa-square-check" style="color:${task.complete == 0 ? "rgb(222, 122, 117)  " : ""
                    }"></ i> 
            </li>
            `;
            });

        });
}

getChildrenTasks();

let task;

function openTask(id) {
    document.querySelector(".overlay").style.display = "flex";
    fetch(`/api/gettask?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
            task = data[0];
            document.querySelector(".modal .task").innerHTML = task.task;
            document.querySelector(".modal .price").innerHTML =
                "Ціна✨:" + task.price;
            document.querySelector(".status").innerHTML =
                "Статус виконання: " + (task.complete == 0 ? "НІ" : "ТАК");
        });
}

document.querySelector("#closeModal").addEventListener("click", () => {
    document.querySelector(".overlay").style.display = "none";
});

document.querySelector("#completeTask").addEventListener("click", () => {
    fetch(`/api/completeTask?id=${task.id}`)
        .then((res) => res.ok)
        .then((data) => {
            openTask(task.id);
            getChildrenTasks();
        });
});

document.querySelector("#unCompleteTask").addEventListener("click", () => {
    fetch(`/api/uncompleteTask?id=${task.id}`)
        .then((res) => res.ok)
        .then((data) => {
            openTask(task.id);
            getChildrenTasks();
        });
});

function getMoney(value) {
    document.querySelector(".check").style.display = "flex";
    const canvas = document.getElementById("receipt");
    const ctx = canvas.getContext("2d");

    // Малюємо фон чека
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Малюємо рамку
    ctx.strokeStyle = "#000";
    ctx.strokeRect(10, 10, 280, 180);

    // Заголовок
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Чек на зняття коштів", 100, 30);

    // Дані
    ctx.font = "14px Arial";
    ctx.fillText(`Знято: ${value} грн`, 20, 60);
    ctx.fillText(`Баланс: ${childrenMoney - value} грн`, 20, 110);

    // Кнопка для завантаження
    document.getElementById("download").addEventListener("click", function () {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "receipt.png";
        link.click();
    });
}

document.querySelector("#getMoney").addEventListener("click", () => {
    alertify.prompt("Ви хочете отримати кошти?", 0, (e, value) => {
        value = Number(value);
        if (value && value > 0) {
            if (value > childrenMoney) {
                alertify.error("Недостатньо коштів");
                return;
            }
            getMoney(value);
            fetch(`/api/getMoney?id=${rab}&value=${value}`)
                .then((res) => res.ok)
                .then((data) => {
                    getChildrenTasks();
                    getChildrenMoney();
                });
        }else{
            alertify.error("Некоректно введені дані");
        }
    });
});


document.querySelector("#closeCheck").addEventListener("click", () => {
    document.querySelector(".check").style.display = "none";
});

document.querySelector("#logout").addEventListener("click", () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    window.location.assign("/");
});
let rab = 0;
let childrenMoney = 0;
function getChildrenMoney() {
    fetch(`/api/getChildrenMoney`)
        .then((res) => res.json())
        .then((data) => {
            childrenMoney = data.score;
            rab = data.id;
            document.querySelector(".wallet #balance").innerHTML = data.score;
        });
}

getChildrenMoney();