const mysql = require('mysql2')
const crypto = require('crypto')

const connection = mysql.createConnection({
    host:"localhost",
    user:"user",
    password:"password",
    database:"db"
})

module.exports =  (conn = connection) => {
    return {
        //this is probably better off elsewhere, or just part of getUser
        "getPassword": (username) => {
            return new Promise((resolve,reject) => {
                conn.query(`select password from users where username = '${username}';`,
                (err,values) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        if(values.length != 0){
                            resolve(values[0].password)
                        }
                        else{
                            resolve(null)
                        }
                    }
                })
            })
    
        },
        "setUser": (user,password) => {
            let hashedPass = crypto.createHash('sha256').update(password+process.env.SALT).digest()
 
            return new Promise((resolve,reject) => {
                let qry = `insert into 
                    users(username,password) 
                    values('${user}','${hashedPass}')`

                conn.query(qry,
                (err,values) => {
                    if(err){
                        console.log(err)
                        resolve(null)
                    }
                    else{
                        resolve(values)
                    }
                })
            })
    
        },
        "getUser": async (user) => {
            return new Promise((resolve,reject) => {
                conn.query(`select id,username,admin from users where username = '${user}'`,
                (err,values) => {
                    if(err){
                        console.log(err)
                        resolve(null)
                    }
                    else{
                        resolve(values[0])
                    }
                })
            })
        },
        "getProfile": async (user) => {
            return new Promise((resolve,reject) => {
                conn.query(`select fullname,username,bio from profiles where username = '${user}'`,
                (err,values) => {
                    if(err){
                        console.log(err)
                        resolve(null)
                    }
                    else{
                        resolve(values[0])
                    }
                })
            })
        },
        "setProfile": (data) => {
            let {id, username} = data 
            return new Promise((resolve,reject) => {
                let qry = `insert into 
                    profiles(userId,username) 
                    values('${id}','${username}')`

                conn.query(qry,
                (err,values) => {
                    if(err){
                        console.log(err)
                        resolve(null)
                    }
                    else{
                        resolve(values)
                    }
                })
            })
        },
        "getArticles": (from, to) => {
            let qry = `select 
            articleId,author,title,date,text,preview
            from articles where id between ${from} and ${to}`
            return new Promise((resolve, reject) => {
                conn.query(qry, (err,values) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(values)
                    }
                })
            })
    
        },
        "getArticle": (articleId) => {
            let qry = `select 
            articleId,author,title,date,text,preview
            from articles where articleId = ${articleId}`
            return new Promise((resolve, reject) => {
                conn.query(qry, (err,values) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(values)
                    }
                })
            })
    
        },
        "setArticle": (values = {}) => {
            let qry = `insert into 
                articles(articleId, author,title,date,text,preview)
                values( 
                    ${values.articleId},
                    "${values.author}",
                    "${values.title}",
                    "${values.date}",
                    "${values.text}",
                    "${values.preview}"
                )`
            return new Promise((resolve, reject) => {
                conn.query(qry, (err) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve('worked')
                    }
                })
            })
        }
    }
}

