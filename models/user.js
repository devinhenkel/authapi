const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

//define model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// on save hook encrypt password
// before save, run this
userSchema.pre('save', function(next){
    // create variable with user model
    const user = this;

    // generate a salt and wait for callback
    bcrypt.genSalt(10, function(err, salt) {
        if(err) { return next(err); }
        // has the pass using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if (err) { return next(err); }
            // overwrite plain text pass with hash
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) { return callback(err) }
        
        callback(null, isMatch);
    });

}

//create model class
const UserModelClass = mongoose.model('user', userSchema);

//export model
module.exports = UserModelClass;