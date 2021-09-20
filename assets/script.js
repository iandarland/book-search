// const axios = require('axios');

let searchTerm = {
    keyword: '',
    author: ""
}

let searchResults = []

$(root).append(`<p>howdy yall</p>`)

$('.author-search').keyup(
    function (){
        const authorEnter = this.value.split(' ').join('+').toLowerCase()
        console.log(authorEnter)
        searchTerm = {...searchTerm, author: authorEnter}
        console.log(searchTerm)
    }
    )
    
    $(".search-bar").keyup(
        function (){
            const keywordEnter = this.value.split(' ').join('+').toLowerCase()
            searchTerm = {...searchTerm, keyword: keywordEnter}
            console.log(searchTerm)
    }
    )
    
    $('.run-search').click(
        function (event){
        event.preventDefault()
        $(root).append(`<p>${searchTerm}</p>`)
        $(root).empty()
        searchBooks(searchTerm)
        console.log(searchResults)

    }
)

const searchBooks = (data) =>{
    let author = ''
    if(data.author){
        author = `+inauthor:${data.author}`
    }
    if(!data.keyword){
        data.keyword = data.author
    }
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${data.keyword}${author}&key=AIzaSyB8Jvy0dfcWAybRKZyYUBicgxyetrhSaLw`)
        .then(res => res.json())
        .then(res => {
            res.items.map((item, index) =>{
                $(root).append(
                    `<div class="card col-12 col-md-6 col-lg-3" style="width: 18rem;">
                        <img src="${item.volumeInfo.imageLinks.thumbnail}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${item.volumeInfo.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${item.volumeInfo.authors[0]}</h6>
                            <p>
                            <a class="btn btn-primary" href="${item.volumeInfo.infoLink}" role="button">
                                Purchase
                            </a>
                            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${index}" aria-expanded="false" aria-controls="collapseExample">
                                Description
                            </button>
                            </p>
                            <div class="collapse" id="collapseExample${index}">
                                <div class="card card-body">
                                ${item.volumeInfo.description}
                                </div>
                            </div>
                            </div>
                            </div>`)
                        })
                        //     <p class="card-text card-desc" maxlength ="200">${item.volumeInfo.description}</p>
                        // <a href="${item.volumeInfo.infoLink}" class="btn btn-primary">Go somewhere</a>
            console.log(res.items)
            searchResults = res.items})
        .then(
            searchTerm = {
                keyword: $('.search-bar').val(),
                author: $('.author-search').val()
            }
        )
}