const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})



//configurar caminhos da minha aplicação
//página inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})




server.get("/create-point", (req, res) => {
    //req.query: Query Strings da nossa URL
    req.query


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: o corpo do nosso formulário

    // Inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("erro no cadastro")
        }

        console.log("cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }
    
    db.run(query, values, afterInsertData) 

})


server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){        //Pesquisa vazia
        return res.render("search-results.html", { total: 0 })
        
    }
    
    //pegar os dados do banco de dados
    db.all(`Select * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err){
            return console.log(err)
        }
        
        const total = rows.length

        //mostrar a página html com os dados do banco de dados 
        return res.render("search-results.html", { places: rows, total: total})
    })
  
})


// ligar o servidor
server.listen(3000)