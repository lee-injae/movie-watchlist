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
            if (data.Response === "False") {
                renderErrMsg()
                hideFilmIcon()
                throw Error("Move not Found!!")
            }
            renderMovieCardHtml(data)
        })
        .catch(err => {
            console.error((err))
        })
}

function renderErrMsg() {
    let errMsgHtml = `
        <div class="error-smg strong">
            <h2>Unable to find what you're looking for. Please try another search.</h2>
        </div>
    `
    moviesEl.innerHTML = errMsgHtml
}

function renderMovieCardHtml(movieObj){
    hideFilmIcon()
    let movieCardHtml = ""
    console.log(movieObj)
    movieCardHtml = `
        <div class="movie-card">
            <img class="movie-poster"src="${movieObj.Poster}"/>
            <div class="movie-title">
                <h2>${movieObj.Title}</h2>
                <img src="assets/star-icon.png" alt="star-icon"/>
                <h4>${movieObj.imdbRating}</h4>
            </div>
            <div class="movie-detail">
                <h4>${movieObj.Runtime}</h4>
                <h4>${movieObj.Genre}</h4>
                <h4 class="watchlist">
                    <img class="plus-btn" 
                        src="./assets/plus-icon.png"
                        data-movie='${movieObj.imdbID}'
                    />
                    <div>Watchlist</div>
                </h4>
            </div>
            <p class="movie-plot">${movieObj.Plot}</p>   
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
    document.getElementById("placeholder").classList.add("hide")
}

