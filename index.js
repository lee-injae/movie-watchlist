const url = "https://www.omdbapi.com/?apikey=36ea6bc0"


const movieContainerClass = document.querySelector(".movies-container")
const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")

let currentlyAddingId = "" 

const localStorageWatchlist = JSON.parse(
    localStorage.getItem("watchlistArray")) || []

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded")
    render()
})

document.addEventListener("click", e => {
    if (e.target.id === "search-btn"){
        e.preventDefault()
        let searchInput = searchInputEl.value
        if (searchInput) {
            showLoading()
            searchMovieCard(searchInput)
            searchInput = ""
        } 
    }

    else if (e.target.classList.contains("plus-btn")){
        let targetMovieID = e.target.dataset.movie
        localStorageWatchlist.includes(targetMovieID) 
        ? alert("This movie is already in the watchlist") 
        : addMovieToWatchlist(targetMovieID)
        // let findDuplicates = watchlist => watchlist.filter(
        //     movieID => (movieID === targetMovieID))
    }

    else if (e.target.classList.contains("minus-btn")){
        let removingMovieID = e.target.dataset.movieId
        removeMovieFromWatchlist(removingMovieID)
    }
})

function render(){
    let page = document.body.id
    switch (page) {
        case "search":
            searchMovieCard()
            break
        case "watchlist":
            getWatchlist()
            break
        // default:
        //     somethingElse()
    }
}

function searchMovieCard(searchString){
    if (searchString){
        fetch(`${url}&s=${searchString}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "False") {
                throw Error("Movie not Found!!")
            } else {
                let moviesArr = data.Search
                let imdbIdArr = []
                moviesArr.forEach( (movieObj) =>  
                    imdbIdArr.push(movieObj.imdbID) 
                )
                hidePlaceholder()
                getMovieCard(imdbIdArr)
            }
            
        })
        .catch(err => {
            console.error((err))
            hidePlaceholder()
            renderErrMsg()
        })
    }  
}

async function getMovieCard(arr){
    let htmlArr = []
    for (const imdbId of arr) {
        try {
            const res = await fetch(`${url}&i=${imdbId}`)
            const data = await res.json()
            showSearchedMovieHtml(data, htmlArr)
        } catch (err) {
            console.log(err);
            renderErrMsg()
        }
    }
    moviesEl.innerHTML = ""
    moviesEl.innerHTML = htmlArr.join(" ")
}

function showSearchedMovieHtml(movieObj, arr){
    const {Poster, Title, imdbRating, imdbID, Genre, Runtime, Plot} = movieObj
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
    arr.push(movieCardHtml)
    return arr
}

async function getWatchlist(){
    moviesEl.innerHTML = ""
    
    if (localStorageWatchlist.length > 0) { 
        hidePlaceholder()
        showLoading()
        
        let movieCardHtml = ""
        let htmlArr = []
     
        for (const movieId of localStorageWatchlist) {
            try {
                const res = await fetch(`${url}&i=${movieId}`)
                const data = await res.json()
                showWatchlistHtml(data, htmlArr, movieCardHtml)
            } catch(err) {
                console.log(err)
                renderErrMsg()
            }
        }
        moviesEl.innerHTML = htmlArr.join(" ")
    }
    else {
        moviesEl.innerHTML = ""
        document.getElementById("placeholder").classList.remove("hide")
    }
}

function showWatchlistHtml(movieObj, arr, str){
    const {Poster, Title, imdbRating, imdbID, Genre, Runtime, Plot} = movieObj
    str = `
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
    arr.push(str)
    return arr
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
}


