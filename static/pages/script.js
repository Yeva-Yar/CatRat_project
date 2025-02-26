 // Функція для додавання нового завдання
 function addTask() {
    // Отримуємо значення, введене користувачем
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim(); // Очищаємо зайві пробіли на початку та в кінці

    // Якщо поле не порожнє, додаємо нове завдання
    if (taskText !== '') {
        const taskList = document.getElementById('taskList'); // Отримуємо список завдань

        // Створюємо новий елемент списку
        const li = document.createElement('li');
        li.classList.add('task');
        li.textContent = taskText;

        // Додаємо елемент до списку
        taskList.appendChild(li);

        // Очищаємо поле вводу після додавання завдання
        taskInput.value = '';
    } else {
        alert('Будь ласка, введіть завдання!');
    }
}