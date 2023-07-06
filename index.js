const url = "https://www.omdbapi.com/?apikey=36ea6bc0"


const movieContainerClass = document.querySelector(".movies-container")

const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")
let watchlist = []
let currentlyAddingId = "" 

document.addEventListener("click", function(e){
    if (e.target.id === "search-btn"){
        e.preventDefault()
        let searchInput = searchInputEl.value
        getMovieCard(searchInput)
        searchInput = ""
    }

    else if (e.target.classList.contains("minus-btn")){
        let removingMovie = e.target.dataset.movieId
        console.log("removing movie: ", removingMovie)
        console.log("dataset: ", e.target.dataset)
        let removingIndex = watchlist.indexOf(removingMovie)
        if (removingIndex !== -1){
            watchlist.splice(removingIndex, 1) //update watchlist array
            localStorage.setItem("watchlistArray", 
                JSON.stringify(watchlist)) //update localstorage
        }
        console.log(watchlist)
        console.log("localstorage after remove", localStorage)
        moviesEl.innerHTML = ""
        renderWatchlist()
        }

    else if (e.target.classList.contains("plus-btn")){
        let targetMovieID = e.target.dataset.movie
        console.log("dataset: ", targetMovieID)
        watchlist.includes(targetMovieID) 
        ? console.log("you already have it", watchlist) 
        : addMovieToWatchlist(targetMovieID)
        // let findDuplicates = watchlist => watchlist.filter(
        //     movieID => (movieID === targetMovieID))
        console.log(localStorage)
    }

    // else if (e.target.id === "watchlist-link"){
    //     console.log("hey")
    //     renderWatchlist()
    // }
})

renderWatchlist()


function addMovieToWatchlist(movieStr){
    watchlist.push(movieStr)
    localStorage.setItem("watchlistArray", JSON.stringify(watchlist))
}

function renderWatchlist(){
    let localStorageWatchlist = JSON.parse(localStorage.getItem("watchlistArray")) || []

    localStorageWatchlist.forEach(function(movieId){
        let movieCardHtml = ""
        let htmlArr = []    

        fetch(`${url}&i=${movieId}`)
            .then(res => res.json())
            .then(data => {        
                movieCardHtml = `
                <div class="movie-card">
                    <img class="movie-poster"src="${data.Poster}"/>
                    <div class="movie-title">
                        <h2>${data.Title}</h2>
                        <img src="assets/star-icon.png" alt="star-icon"/>
                        <h4>${data.imdbRating}</h4>
                    </div>
                    <div class="movie-detail">
                        <h4>${data.Runtime}</h4>
                        <h4>${data.Genre}</h4>
                        <h4 class="watchlist">
                            <img class="plus-btn" 
                                src="./assets/plus-icon.png"
                                data-movie='${data.imdbID}'
                            />
                            <div>Watchlist</div>
                        </h4>
                    </div>
                    <p class="movie-plot">${data.Plot}</p>   
                </div>
                `
                htmlArr.push(movieCardHtml)
                console.log("htmlarr-before promise ", htmlArr)    
            })
            .then(() => {
                console.log("htmlarr-after promise ", htmlArr)    

                moviesEl.innerHTML = htmlArr.join('')
            })
        })

}


function getMovieCard(searchString){
    fetch(`${url}&t=${searchString}`)
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
    moviesEl.innerHTML = ""
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

// document.addEventListener("click", function(e){
//     if (e.target.classList.contains("plus-btn")){
//         let movieID = e.target.dataset.movie
//         console.log("dataset: ", movieID)
//         watchlist.push(movieID)
//         console.log("watchlist: ", watchlist)
    
//         localStorage.setItem("watchListArray", JSON.stringify(watchlist))
//     }
// })

function hideFilmIcon(){
    document.getElementById("placeholder").classList.add("hide")
}

function showLoading(){
    let h3 = document.createElement("h3")
    h3.textContent = "Loading..."
    
}

let ul = document.querySelector('.list');
let li = document.createElement('li');
li.textContent = 'Loading...';
li.className = 'loading-list';
ul.appendChild(li);