const fs = require('fs')
const db = require('../../server/db/mysql')()

fs.readdir('articles/', (err,data) => {
    console.log(data)
    for (file of data){
        let content = JSON.parse(fs.readFileSync("articles/" + file))
        content.text = content.text.replaceAll('"',"'")
        content.articleId = Math.floor(Math.random()*100000)
        content.preview = content.text.substring(0,100)
        //console.log(content.preview)
        db.setArticle(content)
    }
})

