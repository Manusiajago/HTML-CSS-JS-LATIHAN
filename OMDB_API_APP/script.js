// membuat API KEY
const api_key = 'd7436166';
const showMovies = document.getElementById('showMovies');

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

// Event ketika user submit form
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        alert("Masukkan judul film terlebih dahulu");
    }
});

// fungsi untuk ambil data film
async function fetchMovies(query) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&s=${query}`);
        const data = await res.json();

        if (data.Response === 'True') {
            renderMovies(data.Search);
        } else {
            showMovies.innerHTML = `<p>Tidak ada hasil yang ditemukan</p>`;
        }
    } catch (err) {
        console.log("Error: ", err);
    }
}

// fungsi untuk render movie
function renderMovies(movies) {
    showMovies.innerHTML = '';
    movies.forEach((movie) => {
        const movieCard = `
        <div class="movie-card">
          <div class="movie-poster">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/280x400?text=No+Image'}" 
                 alt="${movie.Title}">
          </div>
          <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-description">
                  Tahun rilis: ${movie.Year}
                </p>
            <div class="movie-rating">
              ⭐ Belum ada rating
            </div>
          </div>
        </div>
        `;

        showMovies.innerHTML += movieCard;
    });
}

// jalankan pertama kali
fetchMovies("Batman");
