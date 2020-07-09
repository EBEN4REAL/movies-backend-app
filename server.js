const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

// Models
const {User} = require('./models/user');


app.get('/users' , (req, res) => {
    User.find((err, users) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(users)
    })
}) 

app.get('/' , (req, res) => {
    res.send("HEllo there");
}) 

const port = process.env.PORT || 3002;

app.listen(port , () => {
    console.log(`Server running at ${port}`);
})