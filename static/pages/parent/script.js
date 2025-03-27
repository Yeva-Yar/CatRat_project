document.querySelector("#addChild").addEventListener("click", () => {
    alertify.prompt("Child Name", "", (evt, value) => {
        if (value) {
            let body = JSON.stringify({
                name: value,
            });
            console.log(body);
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
                    alertify.alert("Child code: " + data.code);
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
                <tr>
                    <td>${child.name}</td>
                    <td>${child.code}</td>
                    <td>${child.score}</td>
                    <td>
                        <button onclick="deleteChild(${child.id})">Х</button>
                    </td>
                </tr>`;
            });
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
            setTimeout(() => {
                alertify.prompt("Яка буде винагорода", "", function (e, val) {
                    if (e) {
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
                console.log(i);
                list.innerHTML += `
                <tr>
                    <td>${children.find((ch) => ch.id == i.rab).name}</td>
                    <td>${i.task}</td>
                    <td>${i.price}</td>
                    <td>${i.complete == 0 ? "НІ" : "ТАК"}</td>
                    <td><button onclick="acceptTask(${i.id}, ${i.price}, ${
                    i.rab
                })">Прийняти</button></td>
                    <td><button onclick="deleteTask(${
                        i.id
                    })">Видалити</button></td>
                </tr>
                `;
            });
        });
}
getparentstasks();

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
