if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const port = 3000;
//express
const express = require('express');
const app = express();
//-----------------------------------

const users = require('./users.js');



//bcrypt for password encryption
const bcrypt = require('bcrypt');
//-----------------------------------


//passport authentication stuff
const passport = require('passport');
const initPassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
initPassport(
    passport,
    username => users.find(user => user.name === username),
    userid => users.find(user => user.id == userid)
    );
//----------------------------------------------------------------



//----------------------------------------------- view engine stuff ----------------------------------------------- 
const exprhbs = require("express-handlebars");
var hbs = exprhbs.create({ defaultLayout: null});
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
//---------------------------------------------------------------------

//----------------------------------------- for post methods form stuff -------------------------------------------
app.use(express.urlencoded({extended: false}));
//----------------------------------------------------------------------


app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname + '/public'));

//------------------------------------------------ home route --------------------------------------------------

app.get("/", checkAuthen, (req, res) => {
    res.render('index',{
        pageTitle: "Home Page",
        name: req.user.name
    });
});

//------------------------------------------------- login route -------------------------------------------------
app.get("/login", alreadyLoggedIn, (req, res)=>{
    res.render("login", {
        pageTitle: "Login Page",
    })
})
app.post('/login', alreadyLoggedIn, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect:'/login',
    failureFlash: true,

}) );


//------------------------------------------------- register route -------------------------------------------------
app.get("/register", alreadyLoggedIn, (req, res)=>{
    res.render("register", {
        pageTitle: "Register Page",
    });
});
app.post('/register', alreadyLoggedIn, async (req, res)=>{
    try{
        if(req.body.password === req.body.confirmPassword){            
            const hashedpassword = await bcrypt.hash(req.body.password,10);
            users.push({
                id: new Date().toString(), // thats a good tip
                name: req.body.name,
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
//------------------------------------------------------------------------------------------------------------------

//---------------------------------------- logout ------------------------------------------
app.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login');
})

function checkAuthen(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
function alreadyLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

app.listen(port, () =>{
    console.log(`server is up and running on port ${port}`)
})