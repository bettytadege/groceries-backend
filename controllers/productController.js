const productModel = require("../model/productModel");
const catagoryModel= require("../model/catagoryModel");
const catchAsync = require("../ErrorHandler/catchAsync");
const AppError=require('../ErrorHandler/appError')

// get all product with pagnation,sorting,limit
exports.getAllProduct = catchAsync(async (req, res, next) => {

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

   //find all products
  const products = await productModel
    .find(filter)
    .populate('catagoryID')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);


    //destructure product in good format
    const destructureProduct=(product)=>{
        return{
       id:product._id,
       productName:product.productName,
       productDetail:product.productDetail,
       productImage:product.productImage,
       productStatus:product.productStatus,
       catagoryID:product.catagoryID,
       price:product.price
        }
    }
    // loop over all product
    const data=[]
    for(let i=0; i< products.length ; i++){
        data.push(destructureProduct(products[i]));
    }

    //check if product is null
    if(data.length === 0){
       return new AppError('no data found',404)
    }
    
    //send response
  res.status(200).json({
    status: "success",
    message: "all products",
    reslut:products.length,
    data:{data}
  });
});


//get product by productID
exports.getProductById = catchAsync(async (req, res, next) => {
  //get productId from req.params
  const productId=(req.params.id)
  //find product
  const product = await productModel.findById(productId);
  //check if product is exist
  if(!product){
    return next (new AppError('product not found',404))
   }

//destructure product in good format
  const destructureProduct=(product)=>{
    return{
   id:product._id,
   productName:product.productName,
   productDetail:product.productDetail,
   productImage:product.productImage,
   productStatus:product.productStatus,
   catagoryID:product.catagoryID,
   price:product.price
    }
}
//assign in variable
const data=destructureProduct(product)

//send response
  res.status(200).json({
    status: "success",
    data:{data}
  });
});


//creating  new product
exports.createProduct = catchAsync(async (req, res, next) => {
    
    
    const newProduct= await productModel.create(req.body);
    
    //destructure product in good format
    const destructureProduct=(product)=>{
        return{
       id:product._id,
       productName:product.productName,
       productDetail:product.productDetail,
       productImage:product.productImage,
       productStatus:product.productStatus,
       catagoryID:product.catagoryID,
       price:product.price
        }
    }
    //assign in variable
    const product=destructureProduct(newProduct);
   //send response
    res.status(201).json({
      status: "success",
      message:'product created successfully',
      data:{
        product 
        
    }
      
    });
  });


//delete product by productID
exports.deleteProduct = catchAsync(async (req, res, next) => {
  //get productId
   const  productID=req.params.id
   //find this prodcut if it is exist or not
    const product= await productModel.findById(productID);
   // check if product is found
    if(!product){
      return next(new AppError("there is no product with that id", 404));
    }
    //if found delete
  await productModel.findByIdAndDelete(productID)
  
  //send response
    res.status(200).json({
      status: "success",
      message:'product deleted'
      
    });
  });

//update existing product by productID
  exports.UpdateProduct = catchAsync(async (req, res, next) => {

    //get productID
    const  productID=req.params.id
    //find product by id
      const product=await productModel.findById(productID)

      //check if product is exist
     if(!product){
      next(new AppError ('there is no product with that id',404))
     }
      //if product exist find product and update
      const updatedProduct= await productModel.findByIdAndUpdate(productID,req.body,
        {
        runValidtors:true,
        new:true
      });
      
    
     
   //send response
     res.status(200).json({
       status: "success",
       message:'product deleted',
       data:{updatedProduct}
       
     });
   });