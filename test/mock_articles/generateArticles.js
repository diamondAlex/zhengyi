const db = require('../../server/db/mysql')()

let authors = [
    "Rupert Alastair Montgomery",
    "Algernon Harrington-Smythe",
    "Nigel Fairweather",
    "Peregrine Cavendish",
    "Giles Thackeray",
    "Cedric Leopold Hargreaves",
    "Benedict St. John",
    "Horatio Tennyson",
    "Reginald Granger",
    "Montgomery Beauregard" ,
    "Humphrey Sinclair",
    "Digby Beaumont",
    "Bertram Cornelius Fitzroy",
    "Peregrine Algernon Blackwood",
    "Cedric Davenport",
    "Alistair Worthington",
    "Edgar Templeton",
    "Arthur Beaumont-Smythe",
    "Frederick Fairfax",
    "Reginald Atticus Kensington"
]

let generateArticle = () => {
    let id = Math.floor(Math.random()*20)
    let data = {
        "articleId" : Math.floor(Math.random()*10**6),
        "author" : authors[id],
        "title" : 'title',
        "date" : new Date().toISOString().split("T")[0],
        "text" : "'TESTTTT'",
        "preview" : "'TEST'"
    }

    db.setArticle(data)
}

generateArticle()
