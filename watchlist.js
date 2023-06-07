const moviesEl = document.getElementById("movies")
let watchlist = JSON.parse(localStorage.getItem("watchListArray")) || []

function render(){
    
    console.log(watchlist, typeof watchlist)
    console.log(localStorage)

    let htmlArr = []
    let movieCardHtml = ""

    watchlist.forEach(function(movieId){
        fetch(`https://www.omdbapi.com/?apikey=36ea6bc0&i=${movieId}`)
            .then(res => res.json())
            .then(data => {        
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
                    </hr>
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
    })

render()



