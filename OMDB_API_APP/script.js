// Membuat API KEY
const api_key = 'd7436166';
const showMovies = document.getElementById('showMovies');

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const berandaButton = document.getElementById("berandaMovies");
const favoriteButton = document.getElementById("favoriteButton");
const historyButton = document.getElementById("historyButton");

// Tracking halaman total hasil
let currentPage = 1;
let totalResults = 0;
let totalPages = 0;
let currentQuery = "Batman"; // Set initial query
let isInFavoriteMode = false;
let isInHistoryMode = false;

// Event listener untuk tombol favorit (set mode dan render)
favoriteButton.addEventListener("click", function () {
    isInFavoriteMode = true;
    isInHistoryMode = false;
    renderFavorites();
});

// Event listener untuk tombol history (set mode dan render)
historyButton.addEventListener("click", function () {
    isInHistoryMode = true;
    isInFavoriteMode = false;
    renderHistory();
});

// Fungsi untuk simpan query ke history
function saveToHistory(query) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(query)) {
        history.push(query);
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
}

// Event listener untuk tombol beranda
berandaButton.addEventListener("click", function () {
    isInFavoriteMode = false; // Reset mode
    isInHistoryMode = false; // Reset mode
    // Reset form pencarian
    searchInput.value = "";
    // Reset ke halaman 1
    currentPage = 1;
    // Load film default Batman
    fetchMovies("Batman", 1);
});

// Event ketika user submit form
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    isInFavoriteMode = false; // Reset mode
    isInHistoryMode = false; // Reset mode

    const query = searchInput.value.trim();
    if (query) {
        // Simpan ke history jika belum ada
        saveToHistory(query);
        fetchMovies(query);
    } else {
        alert("Masukkan judul film terlebih dahulu");
    }
});

// Fungsi untuk simpan query ke history
function saveToHistory(query) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(query)) {
        history.push(query);
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
}

// Fungsi untuk ambil data film
async function fetchMovies(query, page = 1) {
    try {
        currentQuery = query;
        currentPage = page;

        showMovies.innerHTML = "<p>Loading...</p>";

        const res = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&s=${query}&page=${page}`);
        const data = await res.json();

        if (data.Response === 'True') {
            totalResults = parseInt(data.totalResults) || 0;
            // OMDb: 10 per halaman
            totalPages = Math.ceil(totalResults / 10);
            renderMovies(data.Search);
            renderPagination();
        } else {
            showMovies.innerHTML = `<p>Tidak ada hasil yang ditemukan</p>`;
            document.getElementById("pagination").innerHTML = "";
        }
    } catch (err) {
        console.log("Error: ", err);
        showMovies.innerHTML = `<p>Error saat memuat data</p>`;
    }
}

// Fungsi untuk render movie (gunakan Promise.all untuk async parallel)
async function renderMovies(movies) {
    showMovies.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Fetch semua detail secara parallel
    const movieDetailsPromises = movies.map(async (movie) => {
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&i=${movie.imdbID}`);
            const details = await res.json();
            const isFavorite = favorites.includes(movie.imdbID);

            return `
            <div class="movie-card">
              <div class="movie-poster">
                <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/280x400?text=No+Image'}" 
                     alt="${details.Title}">
              </div>
              <div class="movie-info">
                <h3 class="movie-title">${details.Title}</h3>
                <p class="movie-description">${details.Plot}</p>
                <div class="movie-rating">⭐ ${details.imdbRating !== "N/A" ? details.imdbRating : "Belum ada rating"}</div>
                <button class="add-favorite" onclick="toggleFavorite('${movie.imdbID}')">
                  ${isFavorite ? "❌ Hapus Favorite" : "❤️ Tambah Favorite"}
                </button>
              </div>
            </div>
            `;
        } catch (error) {
            console.error("Gagal ambil detail:", error);
            return ''; // Skip jika error
        }
    });

    const movieCards = await Promise.all(movieDetailsPromises);
    showMovies.innerHTML = movieCards.join('');
}

// Fungsi toggle favorite (gabung logika add/remove)
function toggleFavorite(imdbID) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(imdbID)) {
        // Hapus dari favorit
        favorites = favorites.filter(id => id !== imdbID);
        alert("Film dihapus dari favorit!");
    } else {
        // Tambah ke favorit
        favorites.push(imdbID);
        alert("Film ditambahkan ke favorit!");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Refresh berdasarkan mode
    if (isInFavoriteMode) {
        renderFavorites();
    } else if (isInHistoryMode) {
        renderHistory();
    } else if (currentQuery) {
        fetchMovies(currentQuery, currentPage);
    }
}

async function renderFavorites() {
    document.getElementById("pagination").innerHTML = ""; // Kosongkan pagination
    showMovies.innerHTML = "<p>Loading favorites...</p>";

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        showMovies.innerHTML = "<p>Belum ada film favorit</p>";
        return;
    }

    showMovies.innerHTML = "";

    // Fetch detail secara parallel
    const favoriteDetailsPromises = favorites.map(async (imdbID) => {
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&i=${imdbID}`);
            const details = await res.json();

            return `
            <div class="movie-card">
              <div class="movie-poster">
                <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/280x400?text=No+Image'}" 
                     alt="${details.Title}">
              </div>
              <div class="movie-info">
                <h3 class="movie-title">${details.Title}</h3>
                <p class="movie-description">${details.Plot}</p>
                <div class="movie-rating">⭐ ${details.imdbRating !== "N/A" ? details.imdbRating : "Belum ada rating"}</div>
                <button class="add-favorite" onclick="toggleFavorite('${imdbID}')">❌ Hapus Favorite</button>
              </div>
            </div>
            `;
        } catch (error) {
            console.error("Gagal ambil detail favorit:", error);
            return ''; // Skip jika error
        }
    });

    const movieCards = await Promise.all(favoriteDetailsPromises);
    showMovies.innerHTML = movieCards.join('');
}

// Fungsi untuk render history
function renderHistory() {
    document.getElementById("pagination").innerHTML = ""; // Kosongkan pagination
    showMovies.innerHTML = "<p>Loading history...</p>";

    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (history.length === 0) {
        showMovies.innerHTML = "<p>Belum ada history pencarian</p>";
        return;
    }

    showMovies.innerHTML = "<h2>History Pencarian</h2><div class='history-list'>";

    history.forEach(query => {
        const escapedQuery = query.replace(/'/g, "\\'");
        showMovies.innerHTML += `
            <div class="history-item">
                <span class="query-text">🔍 ${query}</span>
                <div class="history-actions">
                    <button class="btn-search" onclick="searchFromHistory('${escapedQuery}')">Cari Lagi</button>
                    <button class="btn-delete" onclick="deleteHistory('${escapedQuery}')">Hapus</button>
                </div>
            </div>
        `;
    });

    showMovies.innerHTML += "</div>";
}

// Fungsi untuk search dari history
function searchFromHistory(query) {
    searchInput.value = query;
    isInHistoryMode = false;
    fetchMovies(query);
}

// Fungsi untuk hapus history item
function deleteHistory(query) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history = history.filter(q => q !== query);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    renderHistory(); // Refresh tampilan
}

// ============ PAGINATION ======================
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const escapedQuery = encodeURIComponent(currentQuery); // Escape query untuk cegah break string

    // Tombol prev
    if (currentPage > 1) {
        pagination.innerHTML += `<button onclick="fetchMovies('${escapedQuery}', ${currentPage - 1})">&laquo; Prev</button>`;
    }

    // Nomor halaman (maksimal 5 ditampilkan)
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
        pagination.innerHTML += `
            <button onclick="fetchMovies('${escapedQuery}', ${i})" 
                    class="${i === currentPage ? 'active' : ''}">
                ${i}
            </button>
        `;
    }

    // Tombol next
    if (currentPage < totalPages) {
        pagination.innerHTML += `<button onclick="fetchMovies('${escapedQuery}', ${currentPage + 1})">Next &raquo;</button>`;
    }
}
// ============ PAGINATION ======================

// Jalankan pertama kali
fetchMovies("Batman");