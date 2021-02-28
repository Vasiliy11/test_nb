new Splide(".header__slider", {
  type: "loop",
  arrows: false,
}).mount();

const btn = document.querySelector(".burger__menu");
const menu = document.querySelector(".header__nav ul");
btn.addEventListener("click", () => menu.classList.toggle("active__menu"));
