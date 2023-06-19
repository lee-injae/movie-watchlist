const url = "https://www.omdbapi.com/?apikey=36ea6bc0&t=batman"

const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")
let watchlist = []
let currentlyAddingId = "" 



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
    hideFilmIcon()
    let movieCardHtml = ""
    console.log(movieObj)
    movieCardHtml = `

            <img src="${movieObj.Poster}"/>
            <div class="movie-info">
                <div class="movie-title">
                    <h3>${movieObj.Title}</h3>
                    <img src="assets/star-icon.png" alt="star-icon" />
                    <h4>${movieObj.imdbRating}</h4>
                </div>
                <div class="movie-detail">
                    <h4>${movieObj.Runtime}</h4>
                    <h4>${movieObj.Genre}</h4>
                    <h4>
                        <span>
                            <img class="plus-btn" 
                            src="./assets/plus-icon.png"
                            data-movie='${movieObj.imdbID}'
                        />
                        </span>Watchlist
                    </h4>
                </div>
                <div class="movie-plot">${movieObj.Plot}</div>
            </div>
        `
    moviesEl.innerHTML += movieCardHtml
}

document.addEventListener("click", function(e){
    if (e.target.classList.contains("plus-btn")){
        let movieID = e.target.dataset.movie
        console.log("dataset: ", movieID)
        watchlist.push(movieID)
        console.log("watchlist: ", watchlist)
    
        localStorage.setItem("watchListArray", JSON.stringify(watchlist))
    }
})

function hideFilmIcon(){
    document.getElementById("placeholder").classList.toggle("hide")
}

