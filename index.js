const url = "https://www.omdbapi.com/?apikey=36ea6bc0&t=batman"

const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")
let watchlist = []

document.getElementById("search-btn").addEventListener("click", function(e){
    e.preventDefault()
    let searchInput = searchInputEl.value
    getMovieCard(searchInput)
    searchInputEl.value = ""
})

function getMovieCard(searchString){
    fetch(`https://www.omdbapi.com/?apikey=36ea6bc0&t=${searchString}`)
        .then(res => res.json())
        .then(data => {
            renderMovieCardHtml(data)
        })
}

function renderMovieCardHtml(movieObj){
    let movieCardHtml = ""
    console.log(movieObj)
    movieCardHtml = `
            <img src="${movieObj.Poster}" />
            <h3>${movieObj.Title}<span></span></h3>
            <div>${movieObj.Year}</div>
            <img class="plus-btn" 
                src="./assets/plus-icon.png"
                data-movie-id='${movieObj.imdbID}'
                />
            <h4>Watchlist</h4>
            ${movieObj.imdbRating}
            ${movieObj.Runtime}
            ${movieObj.Genre}
            ${movieObj.Plot}
        `
    moviesEl.innerHTML += movieCardHtml
}

document.addEventListener("click", function(e){
    if (e.target.classList.contains("plus-btn")){
        let addedMovieId = e.target.dataset.movieId
        watchlist.push(addedMovieId)
        localStorage.setItem("watchlistArray", JSON.stringify(watchlist))
    }
})


