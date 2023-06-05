const url = "https://www.omdbapi.com/?apikey=36ea6bc0&t=batman"

const moviesEl = document.getElementById("movies")

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)   
        console.log(data.Title)    
        moviesEl.innerHTML = `
            <h3>${data.Title}</h3>
            <div>${data.Year}</div>
        `
    })




document.getElementById("btn").addEventListener("click", function(e){
    e.preventDefault()
    let hey = document.getElementById("search").value
    // console.log(hey)

    fetch(`https://www.omdbapi.com/?apikey=36ea6bc0&t=${hey}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            moviesEl.innerHTML += `
            <h3>${data.Title}</h3>
            <div>${data.Year}</div>
        `
        })
    document.getElementById("search").value = ""
})

