const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {
    // get email from request
    const email = req.body.email;
    const password = req.body.password;
    
    if (!email || !validator.isEmail(email) || ! password) {
        return res.status(422).send({ error: 'You must provide valid email and password' });
    }

    // check for user with email
    User.findOne({ email: email }, function(err, existingUser){
        if (err) { return next(err); }
        // if a user does exist, return error
        if(existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // if a user does not exist, add them
        const user = new User({
            email: email,
            password: password
        });
        user.save(function(err){
            if (err) { return next (err) }

        });
        res.json({token: tokenForUser(user)});
        // respond to request
    });

}

exports.signin = function(req, res, next) {
    //just need to give them a token since they authed on route
    res.send({ token: tokenForUser(req.user) });
}
