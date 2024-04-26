const express = require("express");
const exphbs = require("express-handlebars");
const mysql2 = require("mysql2");

//Express
const app = express();

//configuração do middleware para verificar solicitações com o tipo de conteúdo do corpo (body)
app.use(
    express.urlencoded({
        extended: true
    })
)


//Configura o middleware para analisar solicitações como tipo de conteúdo
app.use(express.json());

// configurações do handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//primeira rota
app.get("/", (req, res) => {
    //res.send("mandando info na tela ");
    res.render("home")
});

//listando produtos
app.get("/lista", (req, res) => {
    const sql = "SELECT * from produto";


    //função de conexao com o mysql
    conn.query(sql, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        const lista = data;
        res.render("listas", { lista })
    });

})

//cadastrando
app.post("/lista/insertProdutos", (req, res) => {
    const nome = req.body.Nome;
    const preco = req.body.preco;
    const descricao = req.body.descricao;

    // query do SQL para cadastrar
    const sql = `INSERT INTO Produto (Nome, preco, descricao) values ('${nome}', '${preco}', '${descricao}')`;

    conn.query(sql, function (err) {
        if (err) {
            console.log("erro", err);
            return false;
        }

        res.redirect("/lista");
    })
});


//listando e buscando por ID
app.get('/lista/:produtoID', (req, res) => {
    const id = req.params.produtoID
    const sql = `SELECT * FROM Produto WHERE produtoID = ${id}`

    conn.query(sql, function (err, data) {
        if (err) {
            console.log(err);
        }

        const detalhes = data[0];

        res.render('detalhes', { detalhes })
    })

})


// Removendo item
app.post('/lista/remove/:produtoID', (req, res) => {
    const id = req.params.produtoID;

    const sql = `DELETE from Produto WHERE produtoID = ${id}`

    conn.query(sql, function (err) {
        if (err) {
            console.log(err);
        }

        res.redirect('/lista');

    })
});

// Página de edição por ID
app.get('/detalhes/edit/:produtoID', (req, res) => {

    const id = req.params.produtoID;

    const sql = `SELECT * FROM Produto WHERE produtoID  = ${id}`

    conn.query(sql, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        const listaDetalhes = data[0];

        res.render('editdetalhes', { listaDetalhes })

    });

});


// Edição e update  
app.post("/detalhes/updatelista", (req, res) =>{
    const id = req.body.produtoID;
    const produto = req.body.Nome;
    const preco = req.body.preco;
    const descricao = req.body.descricao;

    const sql = `UPDATE Produto set Nome = '${produto}', preco = '${preco}', descricao = '${descricao}' WHERE produtoID = '${id}'`;

    conn.query(sql, function(err) {
        if (err){
            console.log("error", err);
            return;
        }

        res.redirect('/lista');
    });
})


//conexão com banco de dados(variavel conn é uma abreviação de conexão, criando uma variavel para conexao)
const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Mercadinho"
});

// Configuração do banco
conn.connect(function (err) {
    if (err) {
        console.log(err)
    }

    //porta e executando o projeto
    console.log("Conectou ao mysql");
    app.listen(3000);
})





