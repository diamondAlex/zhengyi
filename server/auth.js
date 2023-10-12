const crypto = require("crypto");
const { exit } = require("process");
const db = require('./db/mysql')()
let sessions = []

let getUserFromSession = (req) => {
    let cookie = req.headers['cookie']
    let sessionId = extractSession(cookie)
    return sessions.find((val) => val.sessionId == sessionId).username
}

let clearCookie = (res) => {
    res.setHeader('set-cookie', 
        "secret=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")
}

let generateSession = (username) => {
    let sessionId = crypto.randomBytes(18).toString('base64');
    sessions.push({username:username, sessionId:sessionId });
    return sessionId
}

let getSessions = () => {
    return sessions
}

let removeSession = (cookie) =>{
    let sessionId = extractSession(cookie)
    let index = sessions.findIndex((val) => val.sessionId == sessionId)
    sessions.splice(index,1)
}

//TODO NEED TO TEST THIS. VERY SUSPICIOUS!!! WORKED DESPITE HAVING A BUG!!
let isLoggedIn = (req) => {
    let cookie = req.headers['cookie']
    let sessionId = extractSession(cookie)
    let found = sessions.find((val) => val.sessionId == sessionId) ? true: false;
    return found
}

let extractSession = (cookie) => {
    if(!cookie) return ""

    let info = cookie.split(";")
    let secretInfo = info[0]
    let secret = secretInfo.split("=")

    if(secret[0] != 'secret') return ""

    return secret[1]
}

//this is tricky
let isAdmin = async (req,res) =>{
    if(sessions.length == 0){
        clearCookie(res)
        return 0
    }
    let cookie = req.headers['cookie']
    let sessionId = extractSession(cookie)
    let username = sessions.find((val) => val.sessionId == sessionId).username

    if(!username){
        clearCookie(res)
        return 0
    }

    let user = await db.getUser(username)
    return user.admin
}

module.exports = {getUserFromSession,isAdmin, removeSession, getSessions,generateSession, isLoggedIn}
