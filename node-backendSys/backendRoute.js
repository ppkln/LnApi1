const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretkeyln = 'r22kjhjkhkjsdf65sdf5dfg';
const {body, validationResult} = require("express-validator");


const dbConnection = require('./database');
const { async } = require('rxjs');
const authen = require('./auth');

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
  async (req,res,next)=>{// callback function เพิ่มทำการเพิ่มสมาชิกใหม่เข้าไปในฐานข้อมูล
  console.log('อยู่ใน backend-post-register แล้ว');
  const validation_result = validationResult(req);
  console.log('ค่าของ JSON.stringify(req.body) = '+JSON.stringify(req.body));
  console.log('ค่าของ pws = '+JSON.stringify(req.body.pws));
  if(validation_result.isEmpty()){
    console.log('ผ่าน validation_result.isEmpty แล้ว');
    const idMem = req.body.idMem;
    const email = req.body.email;
    const pws = req.body.pws;
    const fname = req.body.fname;
    await bcrypt.hash(pws,10).then((hash_pass)=>{// เข้ารหัส password ก่อนที่จะบันทึกลงในตารางฐานข้อมูล
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
  console.log('อยู่ใน backend-post-login แล้ว');
  const validation_result = validationResult(req);
  if(validation_result.isEmpty()){
    const email = JSON.stringify(req.body.email);
    const pwsFromuser = JSON.stringify(req.body.pws);
    if(email !=='' && pwsFromuser !==''){
      dbConnection.execute('SELECT * FROM members WHERE email=?',[email])
      .then(async ([rows])=>{
        if(rows.length > 0){
          const hash_db = rows[0].pws;
          let result_hash= await bcrypt.compare(pwsFromuser,hash_db)
          if(result_hash === true){
            const tokenSign = await jwt.sign({idMem:rows[0].idMem,email:rows[0].email},secretkeyln,{expiresIn:'300s'});//สร้าง token อายุ 5 นาที
            console.log('ค่า token ที่สร้างขึ้น = '+tokenSign);
            res.status(200).json({isLoggedIn:true,email:rows[0].email,token:tokenSign});
          }
        } else {
          res.status(200).json({isLoggedIn:false,email:'',token:''});
        }
      })
      .catch(err=>{
        res.status(500).json({isLoggedIn:false,email:'',token:''});
      })
    } else {
      res.status(500).json({isLoggedIn:false,email:'',token:''});
    }

  } else {
    let allErrors = validation_result.errors.map((error)=>{
      return error.msg;
    });
    res.status(500).json({isLoggedIn:false,email:'',token:''});
  }
})

// *********** End Login api *************//

//********* getProfile ******************/
backendRoute.get('/profile/:email',authen,(req,res,next)=>{
  try{
    console.log('ค่า req.params.email = '+req.params.email);
    let email= JSON.stringify(req.params.email);
    dbConnection.execute('SELECT * FROM members WHERE email=?',[email])
    .then(([rows])=>{
      if(rows.length > 0){
        console.log('ค่า rows[0].email (backendRoute.get(profile/:email)) = '+rows[0].email);
        res.status(200).json({idMem:rows[0].idMem,email:rows[0].email,fname:rows[0].fname,isLoggedIn:true});
      } else {
        console.log('ค่า rows[0].email (backendRoute.get(profile/:email)) = หา email นี้ไม่พบในตารางข้อมูล ');
        res.status(200).json({idMem:'',email:'',fname:'',isLoggedIn:false});
      }
    })
    .catch(err=>{
      res.status(200).json({idMem:'',email:'',fname:'',isLoggedIn:false});
    })

  } catch(error){
    res.status(200).json({idMem:'',email:'',fname:'',isLoggedIn:false});
  }
})

//********* end getProfile **************/

//********* getMember-List ******************/
backendRoute.get('/member-list',authen,(req,res,next)=>{
  try{
    console.log('อยู่ใน backendRoute.get(member-list) แล้ว');
    dbConnection.execute('SELECT * FROM members ORDER BY regisdate DESC')
    .then(([rows])=>{
      if(rows.length > 0){
        console.log('ค่าที่ได้จากการ query mysql (backEnd-member-list) JSON.stringify(rows) = '+JSON.stringify(rows));
        res.status(200).json({data:rows,isLoggedIn:true});
      } else {
        res.status(200).json({data:'',isLoggedIn:false});
      }
    })
    .catch(err=>{
      res.status(200).json({data:'',isLoggedIn:false});
    })

  } catch(error){
    res.status(200).json({data:'',isLoggedIn:false});
  }
})
//********* End getMember-List ******************/



//********** test authen ***********/
backendRoute.post('/authenTest',(req,res)=>{
  // try{
      console.log('ค่า req.headers ที่ส่งเข้ามาใน backendRoute-post-authen = '+JSON.stringify(req.headers));
      const token = req.headers.authorization.split(' ')[1];
      console.log('ค่า token ที่ผ่านการ split แล้ว = '+token);
      const decode = jwt.verify(token,secretkeyln);
      res.json({status:'ok',decode});
  // } catch(err){
  //     res.json({status:'error',message:err.message});
  // }

})



module.exports = backendRoute;
