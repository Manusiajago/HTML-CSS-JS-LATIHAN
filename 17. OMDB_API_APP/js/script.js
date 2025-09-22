// API Key OMDB - Ganti dengan API key Anda
const API_KEY = 'd7436166';
const BASE_URL = 'https://www.omdbapi.com/';

// Variabel global untuk menyimpan data
let currentPage = 1;
let totalResults = 0;
let currentQuery = '';
let currentFilters = {};
let favorites = [];
let searchHistory = [];

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    console.log('Aplikasi dimulai...');
    initializeApp();
});

// Fungsi untuk menginisialisasi aplikasi
function initializeApp() {
    // Load data dari localStorage
    loadFavoritesFromStorage();
    loadHistoryFromStorage();

    // Setup event listeners
    setupEventListeners();

    // Setup tabs
    setupTabs();

    // Load film populer sebagai default
    loadDefaultMovies();

    // Render favorites dan history
    renderFavorites();
    renderHistory();

    console.log('Aplikasi berhasil diinisialisasi!');
}

// Setup semua event listeners
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filter controls
    document.getElementById('typeFilter').addEventListener('change', performSearch);
    document.getElementById('yearFilter').addEventListener('change', performSearch);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);

    // Pagination
    document.getElementById('prevPage').addEventListener('click', function () {
        changePage(-1);
    });
    document.getElementById('nextPage').addEventListener('click', function () {
        changePage(1);
    });

    // Modal controls
    document.getElementById('modalClose').addEventListener('click', function () {
        hideModal('movieModal');
    });
    document.getElementById('modalBackdrop').addEventListener('click', function () {
        hideModal('movieModal');
    });

    // Tab navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(btn.dataset.tab);
        });
    });

    // History actions
    document.getElementById('clearHistory').addEventListener('click', clearHistory);

    // Retry button
    document.getElementById('retryBtn').addEventListener('click', performSearch);
}

// Setup tabs
function setupTabs() {
    switchTab('search');
}

// Fungsi untuk switch tab
function switchTab(tabName) {
    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(function (btn) {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) {
        if (content.id === tabName + '-tab') {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Load tab-specific content
    if (tabName === 'favorites') {
        renderFavorites();
    } else if (tabName === 'history') {
        renderHistory();
    }
}

// Load film populer sebagai default
function loadDefaultMovies() {
    console.log('Loading film populer...');
    const popularQueries = ['avengers', 'batman', 'star wars', 'harry potter'];
    const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];

    currentQuery = randomQuery;
    document.getElementById('searchInput').value = randomQuery;
    searchMovies(randomQuery, 1, {});
}

// Fungsi untuk melakukan pencarian
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const typeFilter = document.getElementById('typeFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;

    if (!query) {
        alert('Silakan masukkan kata kunci pencarian');
        return;
    }

    currentQuery = query;
    currentFilters = {
        type: typeFilter,
        year: yearFilter
    };
    currentPage = 1;

    addToHistory(query, currentFilters);
    searchMovies(query, 1, currentFilters);
}

// Fungsi utama untuk mencari film menggunakan fetch
function searchMovies(query, page, filters) {
    console.log('Mencari film:', query, 'halaman:', page, 'filter:', filters);

    if (!API_KEY || API_KEY === 'd7436166') {
        showError('API key belum diatur. Silakan masukkan API key yang valid di dalam kode.');
        return;
    }

    showLoading(true);
    hideError();
    hideNoResults();

    // Buat URL untuk API
    let url = BASE_URL + '?s=' + encodeURIComponent(query) + '&page=' + page + '&apikey=' + API_KEY;

    if (filters.type) {
        url += '&type=' + filters.type;
    }
    if (filters.year) {
        url += '&y=' + filters.year;
    }

    console.log('URL API:', url);

    // Gunakan fetch untuk memanggil API
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Response API:', data);
            showLoading(false);

            if (data.Response === 'True') {
                displayResults(data.Search, data.totalResults, page, query);
                setupPagination(parseInt(data.totalResults), page);
            } else {
                console.log('Error API:', data.Error);
                if (data.Error === 'Invalid API key!') {
                    showError('API key tidak valid. Silakan periksa API key Anda.');
                } else {
                    showNoResults();
                    updateResultsHeader(query, 0);
                }
            }
        })
        .catch(function (error) {
            console.error('Error pencarian:', error);
            showLoading(false);
            showError('Gagal mencari film. Silakan periksa koneksi internet dan coba lagi.');
        });
}

// Fungsi untuk menampilkan hasil pencarian
function displayResults(movies, totalResults, page, query) {
    console.log('Menampilkan hasil:', movies.length, 'film');
    const grid = document.getElementById('moviesGrid');
    grid.innerHTML = '';

    movies.forEach(function (movie) {
        const movieCard = createMovieCard(movie);
        grid.appendChild(movieCard);
    });

    totalResults = parseInt(totalResults);
    currentPage = page;
    updateResultsHeader(query, totalResults);
}

// Fungsi untuk membuat card film
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.addEventListener('click', function () {
        showMovieDetails(movie.imdbID);
    });

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '';
    const isFavorite = favorites.some(function (fav) {
        return fav.imdbID === movie.imdbID;
    });

    card.innerHTML = `
        <div class="movie-poster-container">
            ${posterUrl ?
            `<img src="${posterUrl}" alt="${movie.Title}" class="movie-poster" loading="lazy">` :
            `<div class="movie-poster no-image">🎬</div>`
        }
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${movie.imdbID}', '${movie.Title.replace(/'/g, "\\'")}', '${movie.Year}', '${posterUrl}', '${movie.Type}')">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.Title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${movie.Year}</span>
                <span class="movie-type">${movie.Type}</span>
            </div>
            <div class="movie-actions">
                <button class="action-btn" onclick="event.stopPropagation(); showMovieDetails('${movie.imdbID}')">
                    View Details
                </button>
            </div>
        </div>
    `;

    return card;
}

// Fungsi untuk menampilkan detail film
function showMovieDetails(imdbID) {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        showError('API key belum diatur. Silakan masukkan API key yang valid di dalam kode.');
        return;
    }

    const url = BASE_URL + '?i=' + imdbID + '&apikey=' + API_KEY;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (movie) {
            if (movie.Response === 'True') {
                displayMovieModal(movie);
            } else {
                alert('Gagal memuat detail film');
            }
        })
        .catch(function (error) {
            console.error('Error detail film:', error);
            alert('Gagal memuat detail film');
        });
}

// Fungsi untuk menampilkan modal detail film
function displayMovieModal(movie) {
    const modalBody = document.getElementById('modalBody');
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '';
    const isFavorite = favorites.some(function (fav) {
        return fav.imdbID === movie.imdbID;
    });

    modalBody.innerHTML = `
        <div class="movie-detail">
            <div class="movie-detail-poster-container">
                ${posterUrl ?
            `<img src="${posterUrl}" alt="${movie.Title}" class="movie-detail-poster">` :
            `<div class="movie-poster no-image" style="height: 400px;">🎬</div>`
        }
            </div>
            <div class="movie-detail-info">
                <h1>${movie.Title}</h1>
                <div class="movie-detail-meta">
                    <span class="meta-item">${movie.Year}</span>
                    <span class="meta-item">${movie.Rated}</span>
                    <span class="meta-item">${movie.Runtime}</span>
                    ${movie.imdbRating !== 'N/A' ? `<span class="meta-item rating">⭐ ${movie.imdbRating}</span>` : ''}
                </div>
                
                ${movie.Plot !== 'N/A' ? `<p class="movie-detail-plot">${movie.Plot}</p>` : ''}
                
                <div class="movie-detail-specs">
                    ${movie.Genre !== 'N/A' ? `
                        <div class="spec-item">
                            <div class="spec-label">Genre</div>
                            <div class="spec-value">${movie.Genre}</div>
                        </div>
                    ` : ''}
                    ${movie.Director !== 'N/A' ? `
                        <div class="spec-item">
                            <div class="spec-label">Director</div>
                            <div class="spec-value">${movie.Director}</div>
                        </div>
                    ` : ''}
                    ${movie.Actors !== 'N/A' ? `
                        <div class="spec-item">
                            <div class="spec-label">Actors</div>
                            <div class="spec-value">${movie.Actors}</div>
                        </div>
                    ` : ''}
                    ${movie.Language !== 'N/A' ? `
                        <div class="spec-item">
                            <div class="spec-label">Language</div>
                            <div class="spec-value">${movie.Language}</div>
                        </div>
                    ` : ''}
                    ${movie.Country !== 'N/A' ? `
                        <div class="spec-item">
                            <div class="spec-label">Country</div>
                            <div class="spec-value">${movie.Country}</div>
                        </div>
                    ` : ''}
                    ${movie.BoxOffice !== 'N/A' ? `
                        <div class="spec-item">
                            <div class="spec-label">Box Office</div>
                            <div class="spec-value">${movie.BoxOffice}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="movie-actions">
                    <button class="action-btn" onclick="toggleFavorite('${movie.imdbID}', '${movie.Title.replace(/'/g, "\\'")}', '${movie.Year}', '${posterUrl}', '${movie.Type}'); this.textContent = '${isFavorite ? 'Add to' : 'Remove from'} Favorites'">
                        ${isFavorite ? 'Remove from' : 'Add to'} Favorites
                    </button>
                    ${movie.imdbID ? `
                        <button class="action-btn" onclick="window.open('https://www.imdb.com/title/${movie.imdbID}', '_blank')">
                            View on IMDb
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    showModal('movieModal');
}

// Fungsi untuk toggle favorite
function toggleFavorite(imdbID, title, year, poster, type) {
    const existingIndex = favorites.findIndex(function (fav) {
        return fav.imdbID === imdbID;
    });

    if (existingIndex > -1) {
        // Hapus dari favorites
        favorites.splice(existingIndex, 1);
    } else {
        // Tambah ke favorites
        favorites.push({
            imdbID: imdbID,
            Title: title,
            Year: year,
            Poster: poster,
            Type: type,
            addedDate: new Date().toISOString()
        });
    }

    saveFavoritesToStorage();
    updateFavoriteButtons(imdbID);

    if (document.querySelector('.tab-content.active').id === 'favorites-tab') {
        renderFavorites();
    }
}

// Fungsi untuk update tombol favorite
function updateFavoriteButtons(imdbID) {
    const isFavorite = favorites.some(function (fav) {
        return fav.imdbID === imdbID;
    });

    const favoriteButtons = document.querySelectorAll('.favorite-btn[onclick*="' + imdbID + '"]');
    favoriteButtons.forEach(function (btn) {
        if (isFavorite) {
            btn.classList.add('active');
            btn.textContent = '❤️';
        } else {
            btn.classList.remove('active');
            btn.textContent = '🤍';
        }
    });
}

// Fungsi untuk render favorites
function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyFavorites');

    if (favorites.length === 0) {
        grid.style.display = 'none';
        emptyState.classList.add('active');
    } else {
        grid.style.display = 'grid';
        emptyState.classList.remove('active');
        grid.innerHTML = '';

        favorites.forEach(function (movie) {
            const movieCard = createMovieCard(movie);
            grid.appendChild(movieCard);
        });
    }
}

// Fungsi untuk menambah ke history
function addToHistory(query, filters) {
    const historyItem = {
        query: query,
        filters: filters,
        date: new Date().toISOString(),
        id: Date.now()
    };

    // Hapus jika sudah ada
    searchHistory = searchHistory.filter(function (item) {
        return item.query.toLowerCase() !== query.toLowerCase();
    });

    // Tambah ke awal array
    searchHistory.unshift(historyItem);

    // Simpan hanya 20 pencarian terakhir
    searchHistory = searchHistory.slice(0, 20);

    saveHistoryToStorage();
}

// Fungsi untuk render history
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const emptyState = document.getElementById('emptyHistory');

    if (searchHistory.length === 0) {
        historyList.style.display = 'none';
        emptyState.classList.add('active');
    } else {
        historyList.style.display = 'block';
        emptyState.classList.remove('active');
        historyList.innerHTML = '';

        searchHistory.forEach(function (item) {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.addEventListener('click', function () {
                searchFromHistory(item);
            });

            const date = new Date(item.date).toLocaleDateString();
            const filterText = getFilterText(item.filters);

            historyItem.innerHTML = `
                <div class="history-item-content">
                    <div class="history-query">${item.query}</div>
                    <div class="history-date">${date}${filterText ? ' • ' + filterText : ''}</div>
                </div>
                <div class="history-actions-btn">
                    <button class="history-btn" onclick="event.stopPropagation(); removeFromHistory(${item.id})">🗑️</button>
                </div>
            `;

            historyList.appendChild(historyItem);
        });
    }
}

// Fungsi untuk mendapatkan teks filter
function getFilterText(filters) {
    const parts = [];
    if (filters.type) parts.push(filters.type);
    if (filters.year) parts.push(filters.year);
    return parts.join(', ');
}

// Fungsi untuk pencarian dari history
function searchFromHistory(item) {
    document.getElementById('searchInput').value = item.query;
    document.getElementById('typeFilter').value = item.filters.type || '';
    document.getElementById('yearFilter').value = item.filters.year || '';

    switchTab('search');

    setTimeout(function () {
        currentQuery = item.query;
        currentFilters = item.filters;
        currentPage = 1;
        searchMovies(item.query, 1, item.filters);
    }, 300);
}

// Fungsi untuk hapus dari history
function removeFromHistory(id) {
    searchHistory = searchHistory.filter(function (item) {
        return item.id !== id;
    });
    saveHistoryToStorage();
    renderHistory();
}

// Fungsi untuk clear history
function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat pencarian?')) {
        searchHistory = [];
        saveHistoryToStorage();
        renderHistory();
    }
}

// Fungsi untuk clear filters
function clearFilters() {
    document.getElementById('typeFilter').value = '';
    document.getElementById('yearFilter').value = '';

    if (currentQuery) {
        currentFilters = {};
        performSearch();
    }
}

// Fungsi untuk ganti halaman
function changePage(direction) {
    const newPage = currentPage + direction;
    const maxPage = Math.ceil(totalResults / 10);

    if (newPage >= 1 && newPage <= maxPage) {
        searchMovies(currentQuery, newPage, currentFilters);
    }
}

// Fungsi untuk setup pagination
function setupPagination(totalResults, currentPage) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    const maxPage = Math.ceil(totalResults / 10);

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= maxPage;

    // Generate page numbers
    pageNumbers.innerHTML = '';
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(maxPage, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function () {
            if (i !== currentPage) {
                searchMovies(currentQuery, i, currentFilters);
            }
        });
        pageNumbers.appendChild(pageBtn);
    }

    pagination.style.display = maxPage > 1 ? 'flex' : 'none';
}

// Fungsi untuk update header hasil
function updateResultsHeader(query, totalResults) {
    document.getElementById('resultsTitle').textContent =
        query ? 'Hasil Pencarian untuk "' + query + '"' : 'Film Populer';
    document.getElementById('resultsCount').textContent =
        totalResults.toLocaleString() + ' hasil';
}

// Fungsi untuk menampilkan loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

// Fungsi untuk menampilkan error
function showError(message) {
    const error = document.getElementById('error');
    document.getElementById('errorMessage').textContent = message;
    error.classList.add('active');
}

// Fungsi untuk menyembunyikan error
function hideError() {
    document.getElementById('error').classList.remove('active');
}

// Fungsi untuk menampilkan no results
function showNoResults() {
    document.getElementById('noResults').classList.add('active');
}

// Fungsi untuk menyembunyikan no results
function hideNoResults() {
    document.getElementById('noResults').classList.remove('active');
}

// Fungsi untuk menampilkan modal
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menyembunyikan modal
function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// Fungsi untuk load favorites dari localStorage
function loadFavoritesFromStorage() {
    const stored = localStorage.getItem('movie_favorites');
    if (stored) {
        favorites = JSON.parse(stored);
    }
}

// Fungsi untuk save favorites ke localStorage
function saveFavoritesToStorage() {
    localStorage.setItem('movie_favorites', JSON.stringify(favorites));
}

// Fungsi untuk load history dari localStorage
function loadHistoryFromStorage() {
    const stored = localStorage.getItem('search_history');
    if (stored) {
        searchHistory = JSON.parse(stored);
    }
}

// Fungsi untuk save history ke localStorage
function saveHistoryToStorage() {
    localStorage.setItem('search_history', JSON.stringify(searchHistory));
}