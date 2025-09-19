// Penanganan validasi dan pengiriman form
document.addEventListener('DOMContentLoaded', () => {
    // ambil elemen form dan tombol submit
    const form = document.getElementById('registrationForm');
    const submitBtn = document.querySelectorAll('.submit-btn');

    // penanganan pengiriman form
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Jika validasi berhasil tampilkan pesan sukses
        if (validateForm()) {
            showSuccesMessage();
            resetForm();
        }
    })

    // Validasi realtime ketika user meninggalkan input atau mengetik
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this)
        })

        input.addEventListener('input', (() => {
            clearError(this)
        }))
    });

    // pengecekan konfirmasi password secara realtime
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    //cek kecocokan password ketika user mengecek password
    confirmPasswordInput.addEventListener('input', function () {
        if (passwordInput.value && this.value) {
            if (passwordInput.value !== this.value) {
                showError(this, "password tidak cocok");
            } else {
                clearError(this);
            }
        }
    });

    // penanganan klik tombol media sosial
    document.querySelector('.google-btn').addEventListener('click', function () {
        alert('Tombol Google diklik');
    })

    document.querySelector('.facebook-btn').addEventListener('click', function () {
        alert('facebook akan segera tersedia')
    })

    // penangana klik aturan pakai
    document.querySelector('.terms-link').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Halaman aturan pakai akan segera tersedia');
    })
});

// fungsi untuk memvalidasi seluruh form
function validateForm() {
    let isValid = true;

    //ambil nilai dari semua input form
    const username = document.getElementById('username').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreement = document.getElementById('agreement').checked;

    // validasi username
    if (!username) {
        showError(document.getElementById('username'), 'Username harus di isi');
        isValid = false;
    } else if (username.length < 3) {
        showError(document.getElementById('username'), 'Username minimal 3 karakter');
        isValid = false;
    }

    // lalu validasi nama lengkap
    if (!fullname) {
        showError(document.getElementById('fullname'), "Nama lengkap harus di isi bro");
        isValid = false;
    } else if (fullname.length < 2) {
        showError(document.getElementById('fullname'), "Nama lengkap minimal 2 karakter")
    }

    //  Validasi Email
    if (!email) {
        showError(document.getElementById('email'), "Email harus di isi");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError(document.getElementById('email'), "Email tidak valid");
        isValid = false;
    }

    // validasi password
    if (!confirmPassword) {
        showError(document.getElementById('password'), "Password harus di isi");
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(document.getElementById('password'), "Password tidak cocok");
        isValid = false
    }

    // validasi persetujuan aturan
    if (!agreement) {
        alert(`Anda harus menyetujui aturan pakai untuk melanjutkan pendaftaran`);
        isValid = false;
    }

    return isValid;

}



