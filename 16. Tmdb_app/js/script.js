const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzU5MDMzZWE0ZDJmNmNhZWU2NGQ2NzA3ZWFhYzYzOSIsIm5iZiI6MTczMTIxNTc1MC41LCJzdWIiOiI2NzMwNDE4NjQ1Yjg3MDIzMTk2MmJmY2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.lLXjhhQ9icl5lz3kk-jwn_kyzeESp_yBb9VYFB9rgKM'
const API_URL = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`
const API_IMG = "https://image.tmdb.org/t/p/w500";


const GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

let moviesData = [];
let currentPage = 1;
let perPage = 6

// fetch data popular movies
async function getMovies(url) {
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                accept: "application/json"
            }
        });

        const data = await res.json();
        // showMovies(data.results)
        moviesData = data.results || []
        renderMovies();
        renderPagination()
    } catch (err) {
        console.log("Error: ", err)
    }
}

//membuat searcgInput
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();

    // validasi 
    if (keyword === "") {
        renderMovies();
        renderPagination();
        return
    }

    // filter data film sesuai judul 
    const filtered = moviesData.filter((movie) => {
        return movie.title.toLowerCase().includes(keyword)
    });

    renderFilteredMovies(filtered);
    renderFilteredPagination(filtered);
})

//fungsi render untuk hasil filter
function renderFilteredMovies(filteredMovies) {
    const moviesEl = document.getElementById("movies");
    moviesEl.innerHTML = "";

    filteredMovies.forEach((movie) => {
        return showMovies(movie)
    })
}

function renderFilteredPagination(filteredMovies) {
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = "";
}


//render fil sesuai halaman
function renderMovies() {
    const moviesEl = document.getElementById("movies");
    moviesEl.innerHTML = "";

    //hitung index filmnya
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedMovies = moviesData.slice(start, end);

    //loop
    paginatedMovies.forEach((movie) => {
        return showMovies(movie)
    })
}

// render 1 film

// render 1 film
function showMovies(movie) { // <-- Perbaikan parameter
    const moviesEl = document.getElementById("movies");

    // mapping genre_ids -> nama genre
    const genres = movie.genre_ids
        ? movie.genre_ids.map((id) => GENRE_MAP[id]).join(", ")
        : "";

    const movieEl = document.createElement("div");
    movieEl.classList.add("box");

    movieEl.innerHTML = `
    <div class="box-top">
      <img class="box-image" src="${API_IMG + movie.poster_path}" alt="${movie.title}">
      <div class="title-flex">
        <h3 class="box-title">${movie.title} (${movie.release_date?.slice(0, 4) || "?"})</h3>
        <p class="user-follow-info">⭐ ${movie.vote_average} / 10</p>
      </div>
      <p class="genres">${genres}</p>
      <p class="description">${movie.overview}</p>
    </div>
    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="button">Detail</a>
  `;

    moviesEl.appendChild(movieEl);

}


// fungsi render pagination
function renderPagination() {
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = "";

    const totalPages = Math.ceil(moviesData.length / perPage);
    if (totalPages <= 1) return;

    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.innerHTML = "&laquo;";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies();
            renderPagination();
        }
    };
    paginationEl.appendChild(prevBtn);

    // Page numbers
    const ul = document.createElement("ul");
    ul.className = "pagination-list";

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        end = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
    }

    if (start > 1) {
        ul.appendChild(createPageLi(1));
        if (start > 2) {
            ul.appendChild(createDotsLi());
        }
    }

    for (let i = start; i <= end; i++) {
        ul.appendChild(createPageLi(i, i === currentPage));
    }

    if (end < totalPages) {
        if (end < totalPages - 1) {
            ul.appendChild(createDotsLi());
        }
        ul.appendChild(createPageLi(totalPages));
    }

    paginationEl.appendChild(ul);

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.innerHTML = "&raquo;";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderMovies();
            renderPagination();
        }
    };
    paginationEl.appendChild(nextBtn);

    // Helper functions
    function createPageLi(page, active = false) {
        const li = document.createElement("li");
        if (active) li.className = "active";
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = page;
        a.onclick = (e) => {
            e.preventDefault();
            if (currentPage !== page) {
                currentPage = page;
                renderMovies();
                renderPagination();
            }
        };
        li.appendChild(a);
        return li;
    }
    function createDotsLi() {
        const li = document.createElement("li");
        li.className = "disabled";
        const span = document.createElement("a");
        span.textContent = "...";
        span.style.cursor = "default";
        li.appendChild(span);
        return li;
    }
}


getMovies(API_URL);