// const axios = require('axios');

let searchTerm = {
    keyword: '',
    author: ""
}

let previousSearches = JSON.parse(localStorage.getItem('bookSearches')) || []
let readingList = JSON.parse(localStorage.getItem('readingList')) || []

let searchResults = []

$(root).append(`<p>Lets find some books</p>`)

$('.author-search').keyup(
    function (){
        const authorEnter = this.value.split(' ').join('+').toLowerCase()
        console.log(authorEnter)
        searchTerm = {...searchTerm, author: authorEnter}
    }
    )
    
    $(".search-bar").keyup(
        function (){
            const keywordEnter = this.value.split(' ').join('+').toLowerCase()
            searchTerm = {...searchTerm, keyword: keywordEnter}
    }
    )

    $(document).on("click", ".add-to-list",
        function(){
            const book = this.value
                if(readingList.includes(book)){
                    $(".navbar").append(`
                    <div class="alert alert-warning alert-dismissible fade show alert-fixed" role="alert">
                    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`)
                setTimeout(() =>{
                    const fin = () => $(".alert").remove()
                    $(".alert").fadeOut(400, fin)
                }, 1000)
                }else{
                    readingList.push(book)
                    localStorage.setItem("readingList", JSON.stringify(readingList))
                    $(".navbar").append(`
                        <div class="alert alert-success alert-dismissible fade show alert-fixed" role="alert">
                        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`)
                
                setTimeout(() =>{
                    const fin = () => $(".alert").remove()
                    $(".alert").fadeOut(400, fin)
                }, 1000)

    }}
    )

    $(document).on('click', '.remove-from-list',
        function(event){
            event.preventDefault()
            console.log(this.value)
            readingList = readingList.filter(e => e !== this.value)
            renderReadingList(readingList)
            localStorage.setItem("readingList", JSON.stringify(filteredAry))
        })
    
    $('.run-search').click(
        function (event){
        event.preventDefault()
        $(root).append(`<p>${searchTerm}</p>`)
        $(root).empty()
        searchBooks(searchTerm)
        console.log(searchResults)
        const newHistory = [...previousSearches, searchTerm]
        console.log(newHistory)
        localStorage.setItem("bookSearches", JSON.stringify(newHistory))

    }
)
    $('.reading-list').click(
        async function(event){
            event.preventDefault()
            $('.reading-list').blur()
            renderReadingList(readingList)
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
                            <button class="btn btn-primary add-to-list" type="button" role="button" value="${item.id}">
                                add to readinglist
                            </button>
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

const getReadingList = async (data) =>{
    let pulledList = await Promise.all(data.map(item => {
        return fetch(`https://www.googleapis.com/books/v1/volumes/${item}`)
            .then(res => res.json())
    }))
    return pulledList
}

const renderReadingList = async (data) =>{
    console.log(data)
    $(root).empty()
    const fullList = await getReadingList(data)
    fullList.map((item,index) => {
        $(root).append(
            `<div class="card col-12 col-md-6 col-lg-3" style="width: 18rem;">
                <img src="${item.volumeInfo.imageLinks.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.volumeInfo.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.volumeInfo.authors[0]}</h6>
                    <p>
                        <button class="btn btn-primary remove-from-list" type="button" role="button" value="${item.id}">
                            Remove
                        </button>
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
}

