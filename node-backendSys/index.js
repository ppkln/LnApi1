const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const backendRoute = require('./backendRoute');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(path.join(__dirname,'dist/')));


//base route
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'dist/index.html'))
})

//api root
app.use('/api',backendRoute);

// for pagination
const db = require('./modules/paginateMember');
db.sequelize.sync()
  .then(() => {
    console.log("paginateMember working.");
  })
  .catch((err) => {
    console.log("Failed to paginateMember db: " + err.message);
  });

// config port nodejs server
const port = process.env.port || 8000 ;
app.listen(port,()=>{
  console.log("connected to server on port ", port)
})

// Error Handle
app.use(function(err,req,res,next){
  console.error("นี้คือข้อความจาก Express server: "+err.message);
  if (!err.statusCode) err.statusCode=500;
  res.status(err.statusCode).send("Error handle จาก express server : "+err.message)
})


