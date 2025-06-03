const jwt = require('jsonwebtoken');
const userModel = require("../model/userModel");
const AppError = require('../ErrorHandler/appError');
const authUtils=require('../utils/authUtils')


// register user
exports.signup = catchAsync(async (req, res, next) => {

   // extracts user information from req
    const{ firstName,lastName,email,password,role}=req.body
      
    //find user by email
     const user=await userModel.findOne({email})

    //check if the user is exist in db
     if(user){
      return next(new AppError('user found with this email',400))
     }
     

     //if user is not exist in database create new user
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      role
    });
   
    // generate token using user id and role
    const token = authUtils.signToken(newUser._id, newUser.role)
   
    //send response with status 201,token,message and created user
    res.status(201).json({
      status: "success",
      token, 
      message:'user register successfully',
      data:{
        newUser
        
    }
      
    });
  });

  //this function is to authenticate users using user email and password
  exports.login=catchAsync(async(req,res,next)=>{

    //extracting from email and password req.body
   const{email,password}=req.body

   //check if email and password exist
   if(!email || !password){
    return next(new AppError('please provide email and password',400))
   }

// check the user exist and password is correct 
   const user=await userModel.findOne({email}).select('+password')

   //check if the user found
    if(!user){
      return next(new AppError('no account found with this email',400))
    }

    //check the if password match
   if(!await user.correctPassword(password,user.password)){

    return next(new AppError('incorrect password please insert the correct one',400))
   }

  // generate token by user id and role
    const token= authUtils.signToken(user._id , user.role)

    //send response with status 200,token and success message
    res.status(200).json({
      status:'success',
      message:'login successfully',
      token
    })

  }
  )