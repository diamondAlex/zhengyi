let canvas = document.getElementById("ad")
canvas.className = "ad"

function ad(){
    let div = document.createElement("div")
    div.id = "ad_content"

    let img_number = Math.floor(Math.random() *50)
    
    let img = document.createElement("img")
    img.id = "ad_img"
    img.src = `ad/${img_number}.png`
    img.width = 170
    img.height = 550
    img.style.borderRadius = "5px"

    div.appendChild(img)
    canvas.appendChild(div)

    setInterval(updateAd, 60000)
}

function updateAd(){
    let img_number = Math.floor(Math.random() *50)
    
    let img = document.getElementById("ad_img")
    img.src = `ad/${img_number}.png`
}

