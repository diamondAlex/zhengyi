let articles = []
let mode = 'lightmode'

function setBanner(){
    let div = document.getElementById("header")
    div.style= `background-image: url('${mode}.png')`
}

setBanner()

//Makes the header image link to 1st page
function homeLinkEventListener(){
    let div = document.getElementById("homelink")
    div.addEventListener("click", (e) => {
        if(e.target.id == 'homelink'){
            navigation.navigate('/?page=1')
        }
    })
}
homeLinkEventListener()


//this function is ran on page load and routes to 1st page (new login)
//or to current page (refresh)
function entry(){
    let url = new URL(window.location.href)
    if(url.pathname.includes("article")){
        let id = url.pathname.split("/")[2]
        getArticle(id) 
    }
    else if(url.searh == ''){
        navigation.navigate(url.href + "?page=1")
    }
    else{
        navigation.navigate(url.href)
    }
}

function setEditor(){
    let div = document.getElementById("content")
    div.innerHTML = ""
    let editor = document.createElement("div")
    editor.id = "editor"


    let title = document.createElement("div") 
    title.innerHTML = "title : <textarea id=artTitle />"

    let input = document.createElement("div") 
    input.innerHTML = "article : <br/> <textarea id=artInput />"

    let submit = document.createElement("button") 
    submit.addEventListener("click", (e) => {
        let titleText = document.getElementById("artTitle").value
        let artInput = document.getElementById("artInput").value

        let data = {title:titleText,text:artInput}
        fetch(`http://localhost:8080/admin/editor.api`, {
            method:"POST" ,
            body:JSON.stringify(data)
        })
        .then(() => console.log('added?'))
    })
    submit.innerHTML = "submit"

    editor.appendChild(title)
    editor.appendChild(input)
    editor.appendChild(submit)
    div.appendChild(editor) 
}

//fetches one article
function getArticle(id){
    fetch(`http://localhost:8080/article.api?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            let url = new URL(window.location.href)
            //this makes no sense, why overwrite articles if we have it
            articles = json
            setSelectedArticle(url)
    })
}

//fetches all article data 
function getArticles(newPage = null){
    let params = new URLSearchParams(window.location.search)
    let page = newPage ? newPage : params.get('page') ? params.get('page') : 1

    fetch(`http://localhost:8080/articles.api?page=${page}`)
        .then((response) => response.json())
        .then((json) => {
            articles = json
            setArticles()
    })
}

//handles all navigation
navigation.addEventListener('navigate', event => {
    let url = new URL(event.destination.url);

    if(url.pathname == "/" || url.search.includes('page')){
        event.intercept({ handler:getArticles })
    }
    else if(url.pathname.includes("article")){
        event.intercept({ handler: () => {
            setSelectedArticle(url)
        }})
    }
    else if(url.pathname.includes("editor")){
        event.intercept({ handler: () => {
            setEditor()
        }})
    }
    else if(url.pathname == "/profile"){
        console.log("directing to profile")
        event.intercept({ handler: () => {
            setProfile()
        }})
    }
    else if(url.pathname.includes("login") || url.pathname.includes("signup")){
        //if already logged in
        if(document.cookie != ""){
            event.intercept({ handler:setArticles })
        }
        else{
            if(url.pathname.includes("login")){
                event.intercept({ handler: () => {
                    login()
                }})
            }
            if(url.pathname.includes("signup")){
                event.intercept({ handler: () => {
                    signup()
                }})
            }
        }
    }
    else{
       event.intercept({handler : () => {
            notFound() 
       }})
    }
})

function notFound(){
    let div = document.getElementById('content')
    div.innerHTML = "NOT FOUND"
}

//page navigation at bottom of page
function footer(){
    let div = document.getElementById('content')
    let element = document.createElement("p")
    element.id = "footer"

    let page = 1
    let shown = 7
    let spread = Math.floor(shown/2)

    //getting the page, wow, beautiful
    try{
        page = parseInt(new URL(window.location.href).search.split('=')[1])
    }
    catch{
        console.log("searched page is not a number or possibly some other problem")
    }

    let min = page - spread >= 1 ? page - spread : 1
    let max = min + shown

    let left = document.createElement("a")
    left.innerHTML = '<a> < </a>' 
    left.addEventListener("click", () =>{
        let currentPage = parseInt(document.URL.split("=")[1])
        if(currentPage - 1 >= 1){
            navigation.navigate('/?page=' + (currentPage - 1))
        }
    })
    element.appendChild(left)

    for(let i=min;i<max;i++){
        let ref = document.createElement("a")
        ref.innerHTML = `<a> ${i} </a>` 
        ref.addEventListener("click", () =>{
            navigation.navigate('/?page=' + i)
        })
        element.appendChild(ref)
    }
    
    let right = document.createElement("a")
    right.innerHTML = '<a> > </a>' 
    right.addEventListener("click", () =>{
        let currentPage = parseInt(document.URL.split("=")[1])
        //TODO: try to make the arrow stop at last page
        if(currentPage + 1 <= 10){
            navigation.navigate('/?page=' + (currentPage + 1))
        }
    })
    element.appendChild(right)

    div.appendChild(element)
}

//displays the list of articles 
function setArticles(){
    let div = document.getElementById("content")
    div.innerHTML = ""
    
    for(let article of articles){
        let articleDiv = document.createElement("div")
        articleDiv.id = 'article'

        let title = document.createElement("a")
        let titleText = article.title 
        title.innerHTML= titleText
        title.id = "title"
        title.href = "/article/" + article.articleId 
        
        let articleInfo = document.createElement("p")
        let articleHeaderText = article.date + " - " + article.author
        articleInfo.innerHTML= articleHeaderText
        articleInfo.id = "info"

        let preview = document.createElement("p")
        preview.innerHTML = article.preview

        let href = document.createElement("a")
        href.innerHTML= "read more <br/>"
        href.id = article.articleId
        href.href = "/article/" + article.articleId 

        let underline = document.createElement("p")
        underline.innerHTML = "_____________________________________"

        articleDiv.appendChild(title)
        articleDiv.appendChild(articleInfo)
        articleDiv.appendChild(preview)
        articleDiv.appendChild(href)
        articleDiv.appendChild(underline)
        div.appendChild(articleDiv)
    } 
    footer()
}

//displays selected article
function setSelectedArticle(url){
    let div = document.getElementById("content")
    div.innerHTML=""

    let title = document.createElement("div")
    title.id = 'article'

    let articleDiv = document.createElement("div")
    articleDiv.id = 'article'

    let id = url.pathname.replace("/article/","")

    let currArticle = articles.find(art => art.articleId == id)

    if(!currArticle) div.innerHTML = "not found"
    else{
        title.innerHTML=currArticle.title + "<br/>" + currArticle.author
        div.appendChild(title)
        articleDiv.innerHTML=currArticle.text.replace("\n","<br/><br/>")
        div.appendChild(articleDiv)
    }
}

async function setProfile(){
    console.log('setting profile')
    let div = document.getElementById("content")
    div.innerHTML = `
       results =  
    `
    let data = await fetch(`http://localhost:8080/getprofile.api`)
        .then((response) => response.json())
        .then((json) => {
            //this makes no sense, why overwrite articles if we have it
            div.innerHTML = div.innerHTML + JSON.stringify(json)
            div.innerHTML = div.innerHTML + `<br/> 
                <img src=profile/${json.username}.png></img>`

    })
}

function signup(){
    let div = document.getElementById('content')
    div.innerHTML= `username
        <textarea id='name'></textarea>
        <br/>
        password
        <textarea id='password'></textarea>  
        <br/>
        <button onClick="submit('signup')">  sign up </button>
        <br/>
        <a href="/"> home </a>`
}

function login(){
    let div = document.getElementById('content')
    div.innerHTML= `username
        <textarea id='name'></textarea>
        <br/>
        password
        <textarea id='password'></textarea>  
        <br/>
        <button onClick="submit('login')">  log in </button>
        <br/>
        <a href="/"> home </a>`
}

