const auth = require('./auth')
const crypto = require('crypto')
const db = require('./db/mysql')()

//the setup here is wrong. the db should be passed at instanciation for testing purposes, no point in all of this {x,y} = {}

module.exports = {
    "login": async ({input,res} = {}) => {
        let {password,username} = input
        let hashedPass = crypto.createHash('sha256').update(password+process.env.SALT).digest().toString()
        let loginInfo = await db.getPassword(username)
        if(!loginInfo){
            res.statusCode = 598
            res.end()
        }
        else{
            if(hashedPass == loginInfo){
                let secret = auth.generateSession(username)
                //this should be in auth
                res.setHeader('set-cookie', "secret=" + secret + ";")
                res.end()
            }
            else{
                //wut?
                res.statusCode = 598
                res.end()
            }
        }
    },
    "signup": async ({input, res} = {}) => {
        let {password,username} = input
        await db.setUser(username, password)
        let userId = await db.getUser(username)
        if(userId){
            let profileStatus = await db.setProfile(userId)
            if(profileStatus){
                let secret = auth.generateSession(username)
                res.setHeader('set-cookie', "secret=" + secret + ";")
                res.end()
            }
            else{
                res.statusCode = 501
                res.write("error creating profile")
                res.end()
            }
        }
        else{
            res.statusCode = 599
            res.write("username already exists")
            res.end()
        }
    },
    "islogged": async({req,res} = {}) =>{
        let isLogged = auth.isLoggedIn(req) 
        //using an arbitrary code is so cryptic and weird
        res.statusCode = 200
        res.end()
    },
    "logout": async ({req, res} = {}) => {
        let cookie = req.headers['cookie']
        auth.removeSession(cookie)
        res.end()
    },
    //TODO, fix this cause right now if you delete articles it fucks up the 
    //amount returned, cause the ID is auto increment.
    "articles": async({input, res} = {}) => {
        //max articles per page
        let page = input.get('page')
        let count = input.get('count')

        let from =  (page - 1)* count
        let to = page * count 

        let data = await db.getArticles(from,to)
        res.write(JSON.stringify(data))
        res.end()
    },
    "article": async({input, res} = {}) => {
        let articleId = input.get('id')
        let data = await db.getArticle(articleId)
        res.write(JSON.stringify(data))
        res.end()
    },
    "articlecount": async({input, res} = {}) => {
        let data = await db.getArticleCount()
        let count = data[0]['count']
        res.write(JSON.stringify({count:count}))
        res.end()
    },
    "editor": async({input,res} = {}) =>{
    
    },
    "getprofile": async({input,res,req} = {}) =>{
        if(auth.isLoggedIn(req)){
            let username = auth.getUserFromSession(req)
            let data = await db.getProfile(username)
            console.log(username)
            console.log(data)
            res.write(JSON.stringify(data))
        }
        res.end()
    },
    "updateprofile": async({input,res} = {}) =>{
        let data = {user:"TESTING"}
        console.log("in profile")
        console.log(data)
        res.write(JSON.stringify(data))
        res.end()
    }
}
