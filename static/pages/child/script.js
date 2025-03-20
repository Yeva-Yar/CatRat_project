document.querySelector(".block").addEventListener("click", () => {
    document.querySelector(".overlay").style.display = "flex"
})

document.querySelector("#closeModal").addEventListener("click", () => {
    document.querySelector(".overlay").style.display = "none"
})