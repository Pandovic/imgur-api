const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
// const bcrypt = require('bcrypt')
const app = express()

const PORT  =process.env.PORT || 3007;
const DB_URL = "mongodb://127.0.0.1:27017/blog"

const routes = require('./routes/app')
const path = require('path')


mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('open',()=>console.log("Server connected"))
mongoose.connection.on('err',(err)=>console.log(err))

app.use(cors());
app.use('/postimage', express.static(path.join(__dirname,'public',"postimage")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(routes)

app.listen(PORT)
console.log("App is running on http://localhost:"+PORT)