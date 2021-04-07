const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://admin:admin@cluster0.ljlin.mongodb.net/nodekb?retryWrites=true&w=majority';

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => console.log('Connected to DB'))
    .catch(err => console.log(err));


//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
 
// parse application/json
app.use(express.json())
 
//Bring in models
let Article = require('./models/article');

//Load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Home route
app.get("/", (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: "Articles",
                articles: articles
            });
        }
    })
})

//Get add article route
app.get('/articles/add', (req, res) => {
    res.render('add_article');
})

//Add article route
app.post("/articles/add", (req, res) => {
    const article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.author;

    article.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    })
})

//Detail article route
app.get("/article/:id", (req, res) => {
    let _id = req.params.id;
    Article.findById(_id)
        .then(article => {
            res.render('detail_article', {title: article.title, article: article});
        })
        .catch(err => console.log(err))

})

//Get edit article route
app.get('/article/edit/:id', (req, res) => {
    let _id = req.params.id;
    Article.findById(_id)
        .then(article => res.render('edit_article', {title: article.title, article: article}))
        .catch(err => console.log(err));
})

//Post edit article route
app.post('/article/edit/:id', (req, res) => {
    const article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.author;

    article.update({_id: }, article)
        .then(article => res.redirect('/'))
        .catch(err => console.log(err)); 
})

app.listen(3000, console.log(` Server running on port ${PORT}`))