const Auth = require('./controllers/auth');
const Test = require('./controllers/test');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    app.get('/', function(req, res, next){
        res.send('Welcome!');
    });
    app.get('/test', requireAuth, Test.protected);

    app.post('/signup', Auth.signup);
    app.post('/signin', requireSignin, Auth.signin);
}






