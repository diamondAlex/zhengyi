const auth = require('./auth')
const crypto = require('crypto')
const db = require('./db/mysql')()

//the setup here is wrong. the db should be passed at instanciation for testing purposes, no point in all of this {x,y} = {}
module.exports = {
    //gotta try catch some of this for sure
    "editor": async({input,req,res} = {}) =>{
        let {title, text} = input
        let username = auth.getUserFromSession(req)
        let author = (await db.getProfile(username)).fullname
        let data = {
            articleId : Math.floor(Math.random()*10**6),
            author: author,
            title:title,
            date: new Date().toISOString().split('T')[0],
            text:text,
            preview:text.substring(0,100)
        }
        let result = await db.setArticle(data)
    }
}
