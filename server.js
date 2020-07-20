const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const  bcrypt = require('bcryptjs');
const app = express();  
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require("cors")
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


// ============================
//      Authentication
// ============================
const {auth} = require('./middleware/auth');


// ============================
//      Models
// ============================
const {User} = require('./models/user');


app.post('/api/users/register' , (req,res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save((err,doc) => {
        if(err) return res.json({success: false, err: err});
        res.status(200).json({
            success: true,
            userdata: doc
        })
    })
})

app.post('/api/users/login', (req, res) => {
    User.findOne({email: req.body.email}, (err,user) => {
        if(!user) return res.json({loginSuccess: false, message: 'Auth failed, email not found'})

        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch){
                return res.json({loginSuccess:false, message: "wrong password"});
            }
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie('yts_auth', user.token).status(200).json({
                    loginSuccess: true
                })
            })
        });
    });
    // User.findOne({email: req.body.email}, (err,user) => {
    //     console.log(req.body.password);
    //     console.log(user.password);
    //     if(!user) return res.json({status: false, message: 'Auth Failed, Email not found'})
    //     bcrypt.compare(req.body.password,user.password).then((result)=>{
    //         if(result){
    //             user.generateToken((err, user) => {
    //                 if (err) return res.status(400).send(err);
    //                 res.cookie('yts_auth', user.token).status(200).json({
    //                     loginSuccess: true
    //                 })
    //             })
    //         } else {
    //             return res.json({Status:false, message: "Invalid Login details"});
    //         }
    //       })
    //       .catch((err)=>console.error(err))
    // });
});

app.get('/api/users/logout' , auth ,  (req,res) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ''},
        (err,doc)=>{
            if(err) return res.json({Status:false, err})
            return res.status(200). send({
                success: true
            })
        }
    )
})

const port = process.env.PORT || 3002;

app.listen(port , () => {
    console.log(`Server running at ${port}`);
})