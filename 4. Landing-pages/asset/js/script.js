'use strict';

// Navbar variabel
const menuToggleBtn = document.querySelector("[data-navbar-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

const fungsiElementToggle = function (elem) {
    elem.classList.toggle("active");
}

menuToggleBtn.addEventListener("click", function () {
    fungsiElementToggle(navbar);
})


//membuat keatas
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener('scrool', () => {

    if (window.scrollY >= 800) {
        goTopBtn.classList.add('active');
    } else {
        goTopBtn.classList.remove('active');
    }
})