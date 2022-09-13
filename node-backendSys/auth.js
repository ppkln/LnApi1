const jwt = require('jsonwebtoken');
const secretkeyln = 'r22kjhjkhkjsdf65sdf5dfg';
module.exports = (req,res,next)=>{
  // try{
    console.log('อยู่ในไฟล์ auth แล้ว (middleware ตรวจสอบ token) ');
    if(req.headers.authorization){
      console.log('ค่า req.headers = '+JSON.stringify(req.headers));
      const token = req.headers.authorization.split(' ')[1];
      console.log('ค่า token ที่ผ่านการ split แล้ว (ไฟล์ auth) = '+token);
      const decode = jwt.verify(token,secretkeyln);
      console.log('ค่า decode ที่ผ่านการ jwt.Verify แล้ว (ไฟล์ auth) = '+decode.email);
      if(decode){
        next();
      } else {
        res.status(200).json({idMem:'',email:'',fname:''});
      }
    } else {
      res.status(200).json({idMem:'',email:'',fname:''});
    }
  // } catch(error){
  //   res.status(500).json({status:'error',message:'token ไม่ผ่าน'});
  // }
}
