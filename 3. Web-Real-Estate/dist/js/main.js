const menuBar = document.querySelector(".ri-menu-line");
const menuNav = document.querySelector(".menu");
const bgNav = document.querySelector(".bg-navbar");

menuBar.addEventListener("click", function () {
    menuNav.classList.toggle("menu-active");
    bgNav.classList.toggle("bgNav-active");
})

bgNav.addEventListener('click', () => {
    menuNav.classList.remove("menu-active");
    bgNav.classList.remove("bgNav-active");
})