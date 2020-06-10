// if()
const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const passport = require('passport');
const initPassword = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
initPassword(passport, email => users.find(user => user.email === email) );


//view engine stuff
const exprhbs = require("express-handlebars");
var hbs = exprhbs.create({
    defaultLayout: null,
});
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
//for post methods form stuff
app.use(express.urlencoded({
    extended: false,
}))
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
}))
//users array
var users = [];
//
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render('index',{
        pageTitle: "Home Page",
        name: "medhat"
    });
});
app.get("/login", (req, res)=>{
    res.render("login", {
        pageTitle: "Login Page",
    })
})
app.post('/login', (req,res)=>{

});
app.get("/register", (req, res)=>{
    res.render("register", {
        pageTitle: "Register Page",
    });
});
app.post('/register', async (req, res)=>{
    try{0
        if(req.body.password === req.body.confirmPassword){            
            const hashedpassword = await bcrypt.hash(req.body.password,10);
            users.push({
                id: new Date().toString(), // thats a good tip
                username: req.body.name,
                email: req.body.email,
                password: hashedpassword,            
            })
            res.redirect('/login');
        }
    }catch{
        res.redirect('/register');
    }
    console.log(users);
})

app.listen(port, () =>{
    console.log(`server is up and running on port ${port}`)
})