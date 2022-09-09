const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretkeyln = 'r22kjhjkhkjsdf65sdf5dfg';
const {body, validationResult} = require("express-validator");

const dbConnection = require('./database');

const backendRoute = express.Router();

// **********  Register Member ************//
backendRoute.post('/register',[body('email','email is not empty').trim().not().isEmpty(),body('email',"invalid E-mail address").isEmail().custom((value)=>{
  return dbConnection.execute('SELECT * FROM members WHERE email =?',[value])
  .then(([rows])=>{
    if(rows.length>0){
      return Promise.reject("This e-mail aleady in use!");
    } else {
      return true;
    }
  })
}),body('fname','fname is not empty').trim().not().isEmpty(),
body('pws','The password must be minimum length 6 characters').trim().isLength({min:6})],
(req,res,next)=>{// callback function เพิ่มทำการเพิ่มสมาชิกใหม่เข้าไปในฐานข้อมูล
  console.log('อยู่ใน backend-post-register แล้ว');
  const validation_result = validationResult(req);
  console.log('ค่าของ JSON.stringify(req.body) = '+JSON.stringify(req.body));
  console.log('ค่าของ pws = '+JSON.stringify(req.body.pws));
  if(validation_result.isEmpty()){
    console.log('ผ่าน validation_result.isEmpty แล้ว');
    const idMem = JSON.stringify(req.body.idMem);
    const email = JSON.stringify(req.body.email);
    const pws = JSON.stringify(req.body.pws);
    const fname = JSON.stringify(req.body.fname);
    bcrypt.hash(pws,10).then((hash_pass)=>{// เข้ารหัส password ก่อนที่จะบันทึกลงในตารางฐานข้อมูล
      dbConnection.execute('INSERT INTO members (idMem,email,pws,fname) VALUES(?,?,?,?)',[idMem,email,hash_pass,fname])
      .then((result)=>{
        console.log('ค่าหลังจากส่งไปบันทึกที่ mysql = '+JSON.stringify(result))
        res.status(201).json({status:'ok',message:'บันทึกข้อมูลสำเร็จ'});
      })
      .catch(err=>{
        if(err) throw err;
        res.status(500).json({status:'error',message:'บันทึกข้อมูลล้มเหลว'});
      })
    })
  } else {
    let allErrors = validation_result.errors.map((error)=>{
      return error.msg;
    });
    res.status(201).json({status:'error',message:'ไม่มีข้อมูลส่งมาที่ backEnd'});
  }
})
// ********** End Register Member api ************//

// *********** Login api *************//
backendRoute.post('/login',[body('pws','Password is not empty').trim().not().isEmpty(),
body('pws','Password must be minimum length 6 characters').trim().isLength({min:6}),
body('email','E-mail is not empty').trim().not().isEmpty()]
,(req,res,next)=>{
  console.log('อยู่ใน backend-post-register แล้ว');
  const validation_result = validationResult(req);
  console.log('ค่าของ JSON.stringify(req.body) = '+JSON.stringify(req.body));
  console.log('email (backend-post-login) = '+email);
  if(validation_result.isEmpty()){
    dbConnection.execute('SELECT * FROM members WHERE email=?',[email])
    .then(([rows])=>{

    })
    .catch()

  } else {
    let allErrors = validation_result.errors.map((error)=>{
      return error.msg;
    });
    res.status(201).json({status:'error',message:'ไม่มีข้อมูลส่งมาที่ backEnd'});
  }


})

// *********** End Login api *************//




module.exports = backendRoute;
