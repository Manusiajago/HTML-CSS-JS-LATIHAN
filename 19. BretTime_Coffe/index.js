// TOGGLE MENU DI MOBILE
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click" , function() {
    navLinks.classList.toggle("active");
    
    // cek apakah nav sedang active
    if (navLinks.contains("active")) {
        // kalo aktif ubah jadi x
        hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    } else {
        // kalo ga aktif ubah jadi bar
        hamburger.innerHTML = ' <i class="fa-solid fa-bars"></i>'
    }
})