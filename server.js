const express = require('express');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const app = express();  

const mongoose = require('mongoose');

require('dotenv').config();


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/' , (req, res) => {
    res.send('Hello Eben');
}) 






const port = process.env.PORT || 3002;

app.listen(port , () => {
    console.log(`Server running at ${port}`);
})