const moviesEl = document.getElementById("movies")
let watchlist = JSON.parse(localStorage.getItem("watchlistArray"))



function render(){
    // let watchlist = JSON.parse(localStorage.getItem("watchlistArray"))
    console.log(watchlist, typeof watchlist)
    let html = ""
    watchlist.forEach(function(movieId){
        fetch(`https://www.omdbapi.com/?apikey=36ea6bc0&i=${movieId}`)
            .then(res => res.json())
            .then(data => {
                let movieCardHtml = ""
        
                movieCardHtml = `
                    <img src="${data.Poster}" />
                    <h3>${data.Title}<span></span></h3>
                    <div>${data.Year}</div>
                    <img class="minus-btn" 
                        src="./assets/minus-icon.png"
                        data-movie-id='${data.imdbID}'
                        />
                    <h4>Remove</h4>    
                    ${data.imdbRating}
                    ${data.Runtime}
                    ${data.Genre}
                    ${data.Plot}
                `
            moviesEl.innerHTML += movieCardHtml
            })
        
    })
}



document.addEventListener("click", function(e){
    // let watchlist = JSON.parse(localStorage.getItem("watchlistArray"))
    if (e.target.classList.contains("minus-btn")) {
        let removingMovie = e.target.dataset.movieId
        console.log("removing movie: ", removingMovie)
        watchlist.pop()
        console.log(watchlist)
        render()
        }
    })

render()