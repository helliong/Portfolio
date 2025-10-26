const greetings = document.getElementById('greetings');

const greetingsList = ["Hello.", "Привет.", "Hola.", "Bonjour.", "Ciao.", "こんにちは。", "안녕하세요.", "مرحبا."];

let index = 0;

function updateGreeting() {
        index = (index + 1) % greetingsList.length;
        greetings.textContent = greetingsList[index];
}

setInterval(updateGreeting, 2000);


// document.addEventListener("DOMContentLoaded", () => {
//     const intro = document.querySelector(".intro");

//     setTimeout(() => {
//         intro.classList.add("hidden");
//     }, 19000);
// });