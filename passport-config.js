const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

function initialize(passport,getUserbyEmail){
    async function authenticateUser(email, password, donefn){
        const user = getUserbyEmail(email); //get user or return null
        if(user == null){
            return donefn(null, false, {message: 'no user with that email'});
        }
        else{
            try{
                if (await bcrypt.compare(password, user.password)){
                    return donefn(null, user)
                }
                else{
                    return donefn(null, false, {message: "password doesn't match"})
                }
            }catch(e){
                return donefn(e)
            }         
        }
    }
    passport.use(new localStrategy({
        username: 'name',
        passwordField: 'password'
    },authenticateUser));
    passport.serializeUser((user, donefn)=>{

    });
    passport.deserializeUser((id, donefn)=>{
        
    })
}
module.exports = {
    initialize
}