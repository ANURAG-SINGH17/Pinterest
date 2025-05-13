const express = require('express')
const app = express();
const cookiesParser = require('cookie-parser')
const cors = require("cors");


const connectDB = require('./config/mongoose.connection');

connectDB();


app.use(cors({
    origin: 'https://pintrest-sigma.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({extended:true}));

const userRouter = require('./routes/user.routes')

app.use('/user' , userRouter)

app.get('/' , (req, res) => {
    res.send('backend server started you are in / route')
})

module.exports = app;