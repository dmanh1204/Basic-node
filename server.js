const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

//Check for connect db error
db.on('error', console.error.bind(console, 'connection error:'));

//Check for connect db success
db.once('open', () => {
    console.log('Connected to DB');
})

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
app.get("/articles/add", (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Add route
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
    Article.find({_id: _id}, (err, article) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: article.title,
                article: article
            })
        }
    })
})



app.listen(3000, console.log(` Server running on port ${PORT}`))