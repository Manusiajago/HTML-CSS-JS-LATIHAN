export function menuCloseButton() {
    const menuCloseBtn = document.querySelector('#menu-close-button');

    menuCloseBtn.addEventListener('click', () => {
        document.body.classList.remove('show-mobile-menu');
    })
};