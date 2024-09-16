const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());
dotenv.config();
connectDB();

const PORT = process.env.PORT;

// app.get('/',(req, res)=>{
//     res.send('welcome to insta')
// })

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/friends', require('./routes/friends.js'));



app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`)
})