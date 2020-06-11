const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

function initPassport(passport, getUser, getUserbyID){
    passport.use(new localStrategy({
        usernameField: 'name',
        passwordField: 'password'
    }, async function (username, password, done){
        const user = getUser(username);
        console.log(user);
        if ( user == null){
            return done(null, false, {message: "no user with that name"});
        }
        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user, {message: "Success!"});
            }
            else{
                return done(null, false, {message: "password doesn't match!"});
            }
        } catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        // console.log(getUserbyID(id));
        return done(null, getUserbyID(id))
    });
}
module.exports = initPassport;