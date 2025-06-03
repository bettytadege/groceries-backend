
const catagoryModel= require("../model/catagoryModel");
const catchAsync = require("../ErrorHandler/catchAsync");
const AppError=require('../ErrorHandler/appError')

//this controller is for to get all catagory
exports.getAllCatagory = catchAsync(async (req, res, next) => {

//parseint pagination and limit
  const page = parseInt(req.query.page || 1);//how many page returned and the default is 1 page
  const limit = parseInt(req.query.limit || 10);//how many result returned and the default is 10 result

  // calculate how many documents is skipped 
  const skip = (page - 1) * limit;
  //sorting dynamically the default is to sort by created time in decending order
  const sortBy = req.query.sort 
  ? req.query.sort.split(",").join(" ") 
  : { createdAt: -1 }


//find all catagories with pagnation,sorting and limit
  const catagory = await catagoryModel
    .find()
    .sort(sortBy)
    .skip(skip)
    .limit(limit);


    //if catagory is null
    if(catagory.length === 0){
       return next(new AppError('no catagory found',404))
    }

    //send response with status 200 
  res.status(200).json({
    status: "success",
    message: "all catagory",
    reslut:catagory.length,//how many result
    data:{
      catagory
    }
  });
});


//this controller is to fetch catagories by catagory id
exports.getCatagoryById = catchAsync(async (req, res, next) => {

   //get catagory id from req.parms
  const catagoryID=(req.params.id)
  
  //find catagory by catagoryid
  const catagory = await catagoryModel.findById(catagoryID);
 

//check if the catagory exist
 if(!catagory){
  return next (new AppError('catagory not found',404))
 }

  
//send response
  res.status(200).json({
    status: "success",
    data:{
      catagory
    }
  });
});


//create new catagory
exports.createCatagory = catchAsync(async (req, res, next) => {
    
    const{catagoryName,image}=req.body
     //find catagory by name
    const catagory=await findOne({catagoryName})
    //check if catagory name is found
    if(catagory){
     return next(new AppError('catagory already exist',400))
    }

   //create new catagory from request body
    const newCatagory= await catagoryModel.create({catagoryName,image});
   
    //send response
    res.status(201).json({
      status: "success",
      message:'Catagory created successfully',
      data:{
        newCatagory 
        
    }
      
    });
  });


// this function is for to delete catagory by catagory id
exports.deleteCatagory = catchAsync(async (req, res, next) => {

   const  catagoryID=req.params.id
   //find catagory with this id
    const catagory= await catagoryModel.findById(catagoryID);
  //check if catagory found with this id
    if(!catagory){
      return next(new AppError("there is no catagory with that id", 404));
    }
    //if exist delete
  await catagoryModel.findByIdAndDelete(catagoryID)
  
  //send response  with message
    res.status(200).json({
      status: "success",
      message:'catagory deleted'
      
    });
  });


