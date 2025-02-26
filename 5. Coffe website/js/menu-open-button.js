export function menuOpenButton() {
    const menuOpenBtn = document.querySelector('#menu-open-button');

    menuOpenBtn.addEventListener('click', function () {
        document.body.classList.toggle('show-mobile-menu');
    })
}