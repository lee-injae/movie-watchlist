const url = "https://www.omdbapi.com/?apikey=36ea6bc0&t=batman"

const moviesEl = document.getElementById("movies")
const searchInputEl = document.getElementById("search-input")
const plusBtnEl = document.getElementById("plus-btn")


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
            console.log(data)
            renderMovieCardHtml(data)
        })
}

function renderMovieCardHtml(movieObj){
    let movieCardHtml = ""
    movieCardHtml = `
            <img src="${movieObj.Poster}" />
            <h3>${movieObj.Title}<span></span></h3>
            <div>${movieObj.Year}</div>
            <img class="plus-btn" id="plus-btn" src="./assets/plus-icon.png"/>
            ${movieObj.imdbRating}
            ${movieObj.Runtime}
            ${movieObj.Genre}
            ${movieObj.Plot}
        `
    moviesEl.innerHTML += movieCardHtml
}

document.addEventListener("click", function(e){
    if (e.target.classList.contains("plus-btn")){
        console.log("clicked")
    }
})
