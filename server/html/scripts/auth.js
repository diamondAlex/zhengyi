let logoutHandler = () => {
    if(confirm("are you sure?")){
        //should probably check if it worked before deleting cookie
        fetch('http://localhost:8080/logout.api')
            .then((response) => {
            })
        document.cookie = "secret= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        auth()
    }
    else{
        //TODO: fix this, clicking cancel reroutes to home
        console.log("wut") 
    }
}


//used to insert in the "nav" div either 'login/signup' hrefs when not logged in 
//or a 'logout' href when logged 
async function auth(){
    //when logged in
    let response = await fetch('http://localhost:8080/islogged.api')
    console.log(response)
    if(document.cookie != "" && response.status == 200){
        let div = document.getElementById("nav")
        div.innerHTML = ""

        let logout = document.createElement("a")
        logout.id = "bar"
        logout.innerHTML = "logout"
        logout.href = "/"
        logout.addEventListener("click", logoutHandler)
        let profile = document.createElement("a")
        profile.id = "bar"
        profile.innerHTML = "<img src='profileIcon.png'></img>"
        profile.href = "/profile"
        let editor = document.createElement("a")
        editor.id = "bar"
        editor.innerHTML = "editor &#9998;"
        editor.href = "/editor"

        div.appendChild(profile)
        div.appendChild(logout)
        div.appendChild(editor)
    }
    //when not logged in
    else{
        document.cookie = "secret=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
        let div = document.getElementById("nav")
        div.innerHTML = ""

        let signup = document.createElement("a")
        signup.id = "bar"
        signup.innerHTML = "signup"
        signup.href = window.location.origin + "/signup"
        div.appendChild(signup)

        let login = document.createElement("a")
        login.id="bar"
        login.innerHTML = "login"
        login.href = window.location.origin + "/login"
        div.appendChild(login)
    }
}

function submit(api){
    let bod = JSON.stringify({
        "username":document.getElementById('name').value,
        "password":document.getElementById('password').value
    })
    fetch('http://localhost:8080/'+api+'.api',{
        method:'POST',
        body:bod
    })
    .then(( response ) => {
        if(response.status == 200){
            //updates the div
            auth()
            //reroutes to '/'
            navigation.navigate("/",{history:"replace"})
        }
        else if(response.status == 599){
            alert("The username already exists")
        }
        else{
            alert("it seems the info you've given is wrong")
        }
    })
}
