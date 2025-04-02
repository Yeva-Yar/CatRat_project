document.querySelector("#addChild").addEventListener("click", () => {
    alertify.prompt("Ім'я дитини", "", (evt, value) => {
        value = value.trim();
        if (value.length < 1) {
            alertify.error("Напишіть ім'я дитини");
        }else{
            let body = JSON.stringify({
                name: value,
            });

            fetch("/api/createChild", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: value,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    alertify.alert("Дитину зареєстровано");
                    getChildren();
                });
        }
    });
});

let children = [];

function getChildren() {
    fetch("/api/getChildren")
        .then((res) => res.json())
        .then((data) => {
            children = data;
            let list = document.querySelector(".childList");
            list.innerHTML = "";
            data.forEach((child) => {
                list.innerHTML += `
                <li>
                <div class = "info">
                    <h3>Iмя: ${child.name}</h3>
                    <h4>Баланс: ${child.score}</h4>
                </div>
                <button onclick="copyCode('${child.code}')">Копіювати реєстраційний код</button>
                <button onclick="deleteChild(${child.id})">Х</button>
                    
                </li>`;
            });
            getparentstasks();
        });
}

getChildren();

function deleteChild(id) {
    fetch("/api/deletechild?id=" + id)
        .then((res) => res.ok)
        .then(() => getChildren());
}

document.querySelector("#addTask").addEventListener("click", () => {
    let task = {};
    alertify.prompt("Напишіть опис завдання", "", function (e, val) {
        if (e) {
            task.task = val;
            if (task.task.length < 2) {
                alertify.error("Напишіть опис завдання");
                return;
            }
            setTimeout(() => {
                alertify.prompt("Яка буде винагорода", "", function (e, val) {
                    if (e) {
                        if(val < 0) {
                            alertify.error("Винагорода не може бути від'ємною");
                            return
                        }else if(!Number(val)) {
                            alertify.error("Винагорода повинна бути числом");
                            return
                        }
                        task.price = parseInt(val) || 0;
                        setTimeout(() => {
                            alertify.prompt(
                                "Вкажіть і'мя виконавця",
                                "",
                                function (e, val) {
                                    if (e) {
                                        childId = children.find(
                                            (ch) => ch.name == val
                                        );
                                        if (!childId) {
                                            alertify.error(
                                                "Ви не реєстрували таку дитину"
                                            );
                                            return;
                                        }
                                        task.rab = childId.id;
                                        fetch("/api/addtask", {
                                            body: JSON.stringify(task),
                                            method: "POST",
                                        })
                                            .then((res) => res.ok)
                                            .then((data) => {
                                                getparentstasks();
                                            });
                                    }
                                }
                            );
                        }, 100);
                    }
                });
            }, 100);
        }
    });
});

function getparentstasks() {
    let list = document.querySelector("#taskList");
    list.innerHTML = "";
    fetch("/api/getparentstasks")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((i) => {
                list.innerHTML += `
                <li>
                    <div class="taskInfo">
                        <h4>${i.task}</h4>
                        <p>Виконавець: ${children.find((ch) => ch.id == i.rab).name}</p>
                        <p>Ціна: ${i.price}</p>
                        <p>Стан виконання: ${i.complete == 0 ? "НІ" : "ТАК"}</p>
                    </div>
                    <div class="buttons">
                        <button onclick="acceptTask(${i.id}, ${i.price}, ${i.rab
                    })">Прийняти</button>
                        <button onclick="deleteTask(${i.id
                    })">Видалити</button>
                    </div> 
                </li>
                `;
            });
        });
}
// getparentstasks();

function deleteTask(id) {
    fetch("/api/deleteTask?id=" + id)
        .then((res) => res.ok)
        .then(() => getparentstasks());
}

function acceptTask(id, price, rab) {
    fetch("/api/acceptTask?id=" + id + "&price=" + price + "&rab=" + rab)
        .then((res) => res.ok)
        .then(() => {
            getparentstasks();
            getChildren();
        });
}

document.querySelector("#logout").addEventListener("click", () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    window.location.assign("/");
});


function copyCode(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alertify.success("Код скопійовано");
        })
        .catch(err => {
            alertify.error("Код не скопійовано");
        });
}