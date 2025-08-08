const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav_links');
const menuBtnIcon = menuBtn.querySelector('i');

console.log(navLinks)



menuBtn.addEventListener('click', (e) => {
    navLinks.classList.toggle('open')

    const isOpen = navLinks.classList.contains('open')
    menuBtnIcon.setAttribute('class', isOpen ? "ri-close-line" : "ri-menu-line")
})

navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const navSearch = document.getElementById('nav_search')

navSearch.addEventListener("click", (e) => {
    navSearch.classList.toggle("open");
});

