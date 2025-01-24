const hamburgerMenu = document.querySelector('.ri-menu-line')
const menu = document.querySelector('.menu');

hamburgerMenu.addEventListener('click', () => {
    menu.classList.toggle('menu-active');
})

window.onscroll = () => {
    menu.classList.remove('menu-active');
}

// tombol active
const btnFilter = document.querySelectorAll('.produk .container .box-produk ul li');
const imgFilter = document.querySelectorAll('.produk .container .box-produk .produk-list img');

// 

btnFilter.forEach((data) => {
    data.onclick = () => {
        btnFilter.forEach((data) => {
            data.classList.remove('active');
        })

        data.classList.add('active');

        const btnText = data.textContent;

        imgFilter.forEach((dataImg) => {
            dataImg.style.display = 'none';

            if (btnText.toLowerCase() === 'semua produk' || dataImg.getAttribute('data-filter') === btnText.toLowerCase()) {
                dataImg.style.display = 'block';
            }
        })
    };
});
