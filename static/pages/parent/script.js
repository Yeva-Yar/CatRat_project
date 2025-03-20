document.querySelector("#addChild").addEventListener("click", () => {
    alertify.prompt("Child Name", "", (evt, value) => {
        if (value) {
            fetch("/createChild", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: value
                })
            }).then(res => res.json()).then(data => {
                alertify.alert("Child code: " + data.code)
            })
                }
    })
})