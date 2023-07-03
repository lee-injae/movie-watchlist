const moviesEl = document.getElementById("movies")
let watchlist = JSON.parse(localStorage.getItem("watchListArray")) || []

function renderWatchlist(){
    console.log("whatchlist: ", watchlist)
    console.log("localstorage: ", localStorage.watchListArray)

    watchlist.forEach(function(movieId){
        let movieCardHtml = ""
        let htmlArr = []    

        fetch(`https://www.omdbapi.com/?apikey=36ea6bc0&i=${movieId}`)
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

document.addEventListener("click", function(e){
    if (e.target.classList.contains("minus-btn")) {
        let removingMovie = e.target.dataset.movieId
        console.log("removing movie: ", removingMovie)
        console.log("dataset: ", e.target.dataset)
        let removingIndex = watchlist.indexOf(removingMovie)
        if (removingIndex !== -1){
            watchlist.splice(removingIndex, 1)
            localStorage.setItem("watchListArray", JSON.stringify(watchlist))
        }
        console.log(watchlist)
        console.log("localstorage after remove", localStorage)
        moviesEl.innerHTML = ""
        render()
        }
    else if (e.target.classList.contains("plus-icon")){
        console.log("hee")
    }
    
    
    })

renderWacthlist()



