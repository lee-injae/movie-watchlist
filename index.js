const url = "https://www.omdbapi.com/?apikey=36ea6bc0"

const movieContainerClass = document.querySelector(".movies-container")
const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")

let currentlyAddingId = "" 

let localStorageWatchlist = JSON.parse(
    localStorage.getItem("watchlistArray")) || []

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
        // console.log("local", localStorage)
        // console.log("watchlist", watchlist)
        searchInput = ""
    }

    else if (e.target.classList.contains("plus-btn")){
        let targetMovieID = e.target.dataset.movie
        localStorageWatchlist.includes(targetMovieID) 
        ? console.log("you already have it") 
        : addMovieToWatchlist(targetMovieID)
        // let findDuplicates = watchlist => watchlist.filter(
        //     movieID => (movieID === targetMovieID))
    }

    else if (e.target.classList.contains("minus-btn")){
        let removingMovieID = e.target.dataset.movieId
        // console.log(e.target.dataset.movieId)
        removeMovieFromWatchlist(removingMovieID)
    }
})

function render(){
    let page = document.body.id
    switch (page) {
        case "search":
            getMovieCard()
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
                // hidePlaceholder()
                // renderErrMsg()
                throw Error("Movie not Found!!")
            } 
            // console.log(data)
            hidePlaceholder()
            showSearchedMovieHtml(data)
        })
        .catch(err => {
            console.error((err))
            hidePlaceholder()
            renderErrMsg()
        })
    }     
}

function showSearchedMovieHtml(movieObj){
    const {Poster, Title, imdbRating, imdbID, Genre, Runtime, Plot} = movieObj
    moviesEl.innerHTML = ""
    let movieCardHtml = ""
    movieCardHtml = `
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
                    <img class="plus-btn" 
                        src="./assets/plus-icon.png"
                        data-movie='${imdbID}'
                    />
                    <div>Watchlist</div>
                </h4>
            </div>
            <p class="movie-plot">${Plot}</p>   
        </div>
        `
    moviesEl.innerHTML += movieCardHtml
}

function getWatchlist(){
    if (localStorageWatchlist.length > 0) { 
        hidePlaceholder()
        showLoading()
        let movieCardHtml = ""
        let htmlArr = []
        localStorageWatchlist.forEach( movieId => { 
        fetch(`${url}&i=${movieId}`)
            .then(res => res.json())
            .then(data => {        
                showWatchlistHtml(movieCardHtml, htmlArr, data)
            })
        })
    }
    else {
        moviesEl.innerHTML = ""
        document.getElementById("placeholder").classList.remove("hide")
    }
}

function showWatchlistHtml(htmlStr, htmlArr, movieObj){
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
                                    data-movie-id='${imdbID}'
                                />
                                <div>Watchlist</div>
                            </h4>
                        </div>
                        <p class="movie-plot">${Plot}</p>   
                    </div>
                `
    htmlArr.push(htmlStr)
    return moviesEl.innerHTML = htmlArr.join("")
}

function removeMovieFromWatchlist(movieIdStr){
    let removingIndex = localStorageWatchlist.indexOf(movieIdStr)
    console.log("removing movie index: ", removingIndex)
    if (removingIndex !== -1){
        localStorageWatchlist.splice(removingIndex, 1) //update watchlist array
        localStorage.setItem("watchlistArray", 
            JSON.stringify(localStorageWatchlist)) //update localstorage
    }
    console.log(localStorageWatchlist)
    getWatchlist()
}

function addMovieToWatchlist(movieStr){
    if (movieStr){
        localStorageWatchlist.push(movieStr)
    localStorage.setItem("watchlistArray", JSON.stringify(localStorageWatchlist))
    }   
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
    let h3 = document.createElement("h3")
    h3.textContent = "Loading..."
    h3.className = "loading-list"
    console.log("showingloading")
    moviesEl.prepend(h3)
    // moviesEl.innerHTML = h3
}


