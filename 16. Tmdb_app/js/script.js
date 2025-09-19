const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzU5MDMzZWE0ZDJmNmNhZWU2NGQ2NzA3ZWFhYzYzOSIsIm5iZiI6MTczMTIxNTc1MC41LCJzdWIiOiI2NzMwNDE4NjQ1Yjg3MDIzMTk2MmJmY2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.lLXjhhQ9icl5lz3kk-jwn_kyzeESp_yBb9VYFB9rgKM'
const API_URL = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

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
        showMovies(data.results)
    } catch (err) {
        console.log("Error: ", err)
    }
}

// render movies ke #movies
function showMovies(movies) {
    const moviesEl = document.getElementById
}