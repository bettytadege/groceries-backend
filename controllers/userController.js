const userModel = require("../model/userModel");

const catchAsync = require("../ErrorHandler/catchAsync");
const AppError=require('../ErrorHandler/appError')


exports.getAllUser = catchAsync(async (req, res, next) => {

  //parseint pagination and limit
  const page = parseInt(req.query.page || 1);//how many page returned and the default is 1 page
  const limit = parseInt(req.query.limit || 10);//how many result returned and the default is 10 result

  // calculate how many documents is skipped 
  const skip = (page - 1) * limit;
  //sorting dynamically the default is to sort by created time in decending order
  const sortBy = req.query.sort 
  ? req.query.sort.split(",").join(" ") 
  : { createdAt: -1 }

  const filter={}
//find all users
  const users = await userModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);


  //destructure users in good format
    const destructureUser=(user)=>{
        return{
          id:user._id,
          firstName:user.firstName,
          lastName:user.lastName,
          profileImage:user.profileImg,
          phoneNumber:user.phoneNumber,
          email:user.email,
          password:user.password,
          role:user.role
        }
    }
    //loop over users
    const data=[]
    for(let i=0; i< users.length ; i++){
        data.push(destructureUser(users[i]));
    }

    
    //check if  user is null
    if(data.length === 0){
       return new AppError('no user found',404)
    }
    //send response
  res.status(200).json({
    status: "success",
    message: "all users",
    reslut:data.length,
    data:{data}
  });
});







// exports.createUser = catchAsync(async (req, res, next) => {
    
//     const newUser= await userModel.create(req.body);
//     // console.log(newProduct)
//     const destructureUser=(user)=>{
//         return{
//        id:user._id,
//        firstName:user.firstName,
//        lastName:user.lastName,
//        profileImage:user.profileImg,
//        phoneNumber:user.phoneNumber,
//        email:user.email,
//       //  password:user.password,
//        role:user.role
//         }
//     }
//     const user=destructureUser(newUser);

//     res.status(201).json({
//       status: "sucess",
//       message:'user created successfully',
//       data:{
//         user 
        
//     }
      
//     });
//   });







 