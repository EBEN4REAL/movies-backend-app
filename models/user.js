const mongoose = require('mongoose');
const  bcrypt = require('bcryptjs');
const SALT = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: String,
        minLength: 6
    },
    token: {
        type: String
    }
})

userSchema.pre('save', (next) => {
    let user = this;
    if(user.isModified('password')){  
        bcrypt.genSalt(SALT,  (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt,  (err, hashed) => {
                if (err) return next(err);
                user.password = hashed;
                next();
            })
        })
    }
    else{
        next();
    }
})

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);

    });
}
// userSchema.methods.generateToken = function(callback){
//     let user = this;
//     let token = jwt.sign(user._id.toHexString(), process.env.SECRET);

//     user.token = token;
//     user.save((err,user) => {
//         if(err) return callback(err);
//         callback(null, user);
//     })
// }

// userSchema.statics.findByToken =  function(token, callback){
//     var user = this;
//     jwt.verify(token, process.env.SECRET, function(err, decode){
//         user.findOne({"_id": decode, "token": token}, function(err,user){
//             if(err) return callback(err);
//             callback(null,user);
//         })
//     })
// }

const User = mongoose.model("User", userSchema);

module.exports = {User}