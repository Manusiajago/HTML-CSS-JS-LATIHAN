// Cart
const cartIcon = document.getElementById('cart_icon');
const cart = document.querySelector('.cart');
const cartClose = document.getElementById('cart-close');
const addCartButtons = document.querySelectorAll('.add-cart')

cartIcon.addEventListener('click', function () {
    cart.classList.add("active");
})

cartClose.addEventListener('click', function () {
    cart.classList.remove("active")
})

// addCartButtons
addCartButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox)
    })
});

// fungsi tambah keranjang
const cartContent = document.querySelector('.cart-content');
function addToCart(productBox) {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    const cartItems = document.querySelectorAll('.cart-product-title');
    for (let item of cartItems) {
        console.log("Ini isi item: ", item)
        if (item.textContent === productTitle) {
            alert("Produk ini sudah anda tambahkan ke keranjang")
            return;
        }
    }

    // membuat cartBox baru
    const cartBox = document.createElement("div");
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
                <img src="${productImgSrc}" alt="cart-img" class="cart-img">


                <div class="cart-detail">
                    <h2 class="cart-product-title">${productTitle}</h2>
                    <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">1</span>
                        <button id="increment">+</button>
                    </div>
                </div>
                <i class="ri-delete-bin-5-line cart-remove"></i>
    `

    cartContent.appendChild(cartBox)

    // remove cartBox
    cartBox.querySelector('.cart-remove').addEventListener('click', function () {
        cartBox.remove()

        updateCartCount(-1)

        updateTotalPrice()
    })

    // Tambah dan kurang
    cartBox.querySelector('.cart-quantity').addEventListener('click', function (event) {
        const numberElement = cartBox.querySelector('.number');
        const decrementButton = cartBox.querySelector('#decrement');
        let quantity = numberElement.textContent;

        if (event.target.id === "decrement" && quantity > 1) {
            quantity--;
            if (quantity === 1) {
                decrementButton.style.color = "#999";
            }
        } else if (event.target.id === "increment") {
            quantity++;
            decrementButton.style.color = "#333"
        }

        numberElement.textContent = quantity;

        updateTotalPrice()
    })

    updateCartCount(1)

    updateTotalPrice()

}

// update price
function updateTotalPrice() {
    const totalPriceElement = document.querySelector('.total-price');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const qtyElement = cartBox.querySelector('.number');
        const price = priceElement.textContent.replace("Rp.", "")
        const qty = qtyElement.textContent;
        total += price * qty;
    })

    totalPriceElement.textContent = `Rp. ${total}`
}

let cartItemCount = 0;
function updateCartCount(change) {
    const cartItemCountBadge = document.querySelector('.cart-item-count');
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
}

const btnBeliSekarang = document.querySelector('.btn-buy');
btnBeliSekarang.addEventListener('click', function () {
    const cartBoxes = cartContent.querySelectorAll('.cart-box')

    if (cartBoxes.length === 0) {
        alert(`Keranjang kamu kosong, tolong tambahkan item terlebih dahulu sebelum anda membeli`);
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove())

    cartItemCount = 0;
    updateCartCount(0)
    updateTotalPrice()

    alert('terimakasih sudah membeli')
})