const url = "https://www.omdbapi.com/?apikey=36ea6bc0"

const movieContainerClass = document.querySelector(".movies-container")
const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")

let watchlist = []
let currentlyAddingId = "" 

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded")
    render()
})

document.addEventListener("click", e => {
    if (e.target.id === "search-btn"){
        e.preventDefault()
        let searchInput = searchInputEl.value
        showLoading()
        getMovieCard(searchInput)
        searchInput = ""
    }

    else if (e.target.classList.contains("plus-btn")){
        let targetMovieID = e.target.dataset.movie
        console.log("dataset: ", targetMovieID)
        watchlist.includes(targetMovieID) 
        ? console.log("you already have it", watchlist) 
        : addMovieToWatchlist(targetMovieID)
        // let findDuplicates = watchlist => watchlist.filter(
        //     movieID => (movieID === targetMovieID))
        console.log("localstorage", localStorage)
        console.log("watchlist", watchlist)
    }

    else if (e.target.classList.contains("minus-btn")){
        let removingMovie = e.target.dataset.movieId
        removeMovieFromWatchlist(removingMovie)
    }
})

function render(){
    let page = document.body.id
    console.log(page)
    switch (page) {
        case "search":
            getMovieCard()
            console.log(localStorage)
            break
        case "watchlist":
            getWatchlist()
            break
        // default:
        //     somethingElse()
    }
}

function getMovieCard(searchString){
    if (searchInputEl.value) {
        fetch(`${url}&t=${searchString}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "False") {
                hidePlaceholder()
                renderErrMsg()
                throw Error("Move not Found!!")
            }
            hidePlaceholder()
            showSearchedMovieHtml(data)
        })
        .catch(err => {
            console.error((err))
        })
    }     
}

function showSearchedMovieHtml(movieObj){
    moviesEl.innerHTML = ""
    let movieCardHtml = ""
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

function getWatchlist(){

    

    let localStorageWatchlist = JSON.parse(
        localStorage.getItem("watchlistArray")) 
        || []

    console.log("localstoragewatchlist", localStorageWatchlist) 

    if (localStorageWatchlist.length > 0) { 
        hidePlaceholder()
        showLoading()
        let movieCardHtml = ""
        localStorageWatchlist.forEach( movieId => { 
        fetch(`${url}&i=${movieId}`)
            .then(res => res.json())
            .then(data => {        
                showWatchlistHtml(movieCardHtml, data)
            })
        })
    }
}

function showWatchlistHtml(htmlStr, movieObj){
    const {Poster, Title, imdbRating, imdbID, Genre, Runtime, Plot} = movieObj
    moviesEl.innerHTML = ""
    htmlStr = `
                    <div class="movie-card">
                        <img class="movie-poster"src="${Poster}"/>
                        <div class="movie-title">
                            <h2>${Title}</h2>
                            <img src="assets/star-icon.png" alt="star-icon"/>
                            <h4>${imdbRating}</h4>
                        </div>
                        <div class="movie-detail">
                            <h4>${Runtime}</h4>
                            <h4>${Genre}</h4>
                            <h4 class="watchlist">
                                <img class="minus-btn" 
                                    src="./assets/minus-icon.png"
                                    data-movie='${imdbID}'
                                />
                                <div>Watchlist</div>
                            </h4>
                        </div>
                        <p class="movie-plot">${Plot}</p>   
                    </div>
                `
    return moviesEl.innerHTML += htmlStr
}

function removeMovieFromWatchlist(movieIdStr){
    console.log("removing movie: ", movieIdStr)
    let removingIndex = watchlist.indexOf(removingMovie)
    if (removingIndex !== -1){
        watchlist.splice(removingIndex, 1) //update watchlist array
        localStorage.setItem("watchlistArray", 
            JSON.stringify(watchlist)) //update localstorage
    }
    console.log(watchlist)
    console.log("localstorage after remove", localStorage)
}

function addMovieToWatchlist(movieStr){
    watchlist.push(movieStr)
    localStorage.setItem("watchlistArray", JSON.stringify(watchlist))
}

function renderErrMsg() {
    let errMsgHtml = `
        <div class="error-msg strong">
            <h2>Unable to find what you're looking for. Please try another search.</h2>
        </div>
    `
    moviesEl.innerHTML = errMsgHtml
}

function hidePlaceholder(){
    document.getElementById("placeholder").classList.add("hide")
}

function showLoading(){
    console.log("loading")
    let h3 = document.createElement("h3")
    h3.textContent = "Loading..."
    h3.className = "loading-list"
    moviesEl.appendChild(h3)
}


