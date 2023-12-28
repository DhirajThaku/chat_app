const User = require('../model/userModel');
const brcypt = require('bcrypt');   //for encryption of password

//await only valid inside async

module.exports.register = async(req,res,next)=>{
 try{
    const {username,email,password}=req.body;
 const usernameCheck= await User.findOne({username});  //checking in database for username already present or not

 if(usernameCheck){
    return res.json({msg:"Username already exist",status:false});
    
 }

 const emailCheck= await User.findOne({email});
 if(emailCheck){
    return res.json({msg:"email already exist",status:false});
    
 }

 const hashedPassword =  await brcypt.hash(password,10);
 const user = await User.create({
    email,
    username,
    password:hashedPassword,
 });

 delete user.password;

 return res.json({status:true,user});
 } catch(ex){
    next(ex);
 }
};

module.exports.login = async(req,res,next)=>{
    try{
       const {username,password}=req.body;
    const user= await User.findOne({username});  //checking in database for username already present or not
   
    if(!user){
       return res.json({msg:"incorrect username or passsword",status:false});
       
    }
   
    const isPasswordValid = await brcypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.json({msg:"incorrect username or passsword",status:false});
    }
    delete user.password;
   
    return res.json({status:true,user});
    } catch(ex){
       next(ex);
    }
   };

   module.exports.setAvatar = async(req,res,next)=>{
     try{
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(userId,{
        isAvatarImageSet:true,
        avatarImage,
      });
      return res.json({
        isSet: userData.isAvatarImageSet,
        image:userData.avatarImage
    });
     }catch(ex){
        next(ex);
     }

   };   


   module.exports.getAllUsers = async(req,res,next)=>{

    //why we are using try catch because there is an unexpected error on server side if we can not handle it then server may crashed
    try{
      const users = await User.find({_id: {$ne : req.params.id}}).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);

      return res.json(users);
    }catch(ex){
      next(ex);
    }

   };