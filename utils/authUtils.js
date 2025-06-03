const jwt=require('jsonwebtoken');
const { promisify } = require('util');
const userModel = require('../model/userModel');

//sign token
exports.signToken=( id,role)=>{
    return jwt.sign(
      {
        id: id,
        role: role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRED_IN }
    );


};

//verify token

 exports.getUserId=async (token)=>{
    try {
        const decode=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
        console.log('decode',decode)

        const user=await userModel.findById(decode.id)
        //check if the user exist in database
        if(!user){
            return null //if invalid return null
        }

        return{id:decode.id, role:decode.role}

        
    } catch (error) {
        return null
        
    }

    
 }
