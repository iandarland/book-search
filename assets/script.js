// const axios = require('axios');

let searchResults = []

$(root).append(`<p>howdy yall</p>`)

$(".search-bar").change(
    function (){
        const searchTerm = this.value
        console.log(searchTerm)
        $(root).append(`<p>${searchTerm}</p>`)
        searchBooks(searchTerm)
        console.log(searchResults)
    }
)

const searchBooks = (data) =>{
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${data}&key=AIzaSyB8Jvy0dfcWAybRKZyYUBicgxyetrhSaLw`)
        .then(res => res.json())
        .then(res => {
            res.items.map(item =>{
                $(root).append(`<p>${item.volumeInfo.title} by: ${item.volumeInfo.authors[0]}</p>`)
            })
            console.log(res.items)
            searchResults = res.items})
}