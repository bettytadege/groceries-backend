const orderModel = require("../model/orderModel");
const userModel= require("../model/userModel");
const catchAsync = require("../ErrorHandler/catchAsync");
const AppError=require('../ErrorHandler/appError')

// get all order with pagnation,sorting and limit
exports.getAllOrder = catchAsync(async (req, res, next) => {

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

  //find all orders
  const orders = await orderModel
    .find(filter)
    .populate('productID')//populate productId to get product info
    .populate('userID')//populate productId to get user info
    .sort(sortBy)//sortby
    .skip(skip)//skip results
    .limit(limit);//limit result


    // destructure order into a good format
    const destructureOrder=(order)=>{
        return{
          id:order._id,
          productID:order.productID,
          userID:order.userID,
          totalAmount:order.totalAmount,
          quantity:order.quantity,
          orderStatus:order.orderStatus,
          orderDate:order.orderDate,
        }
    }
    //array to hold destructure order
    const data=[]
    //loop over all order
    for(let i=0; i< orders.length ; i++){
        data.push(destructureOrder(orders[i]));
    }

    
   //check if data is null
    if(data.length === 0){
       return next(new AppError('no order yet',404))
    }

    //send reponse 
  res.status(200).json({
    status: "success",
    message: "all products",
    reslut:orders.length,
    data:{data}
  });
});


//get order by order id
exports.getOrderById = catchAsync(async (req, res, next) => {
  //get order id from req.params
  const orderId=(req.params.id)
  //find by order id
  const order = await orderModel.findById(orderId);
  
 //check if order is exist
  if(!order){
    return next (new AppError('order not found',404))
   }

// destructure order into a good format
  const destructureOrder=(order)=>{
    return{
   id:order._id,
   productID:order.productID,
   userID:order.userID,
   quantity:order.quantity,
   orderStatus:order.orderStatus,
   orderDate:order.orderDate,

    }
}
//assign into new variable
const data=destructureOrder(order)
//send response
  res.status(200).json({
    status: "success",
    data:{data}
  });
});


//create new order
exports.createOrder = catchAsync(async (req, res, next) => {

  //create order
  const newOrder = await orderModel.create(req.body);
  
  // calculate total amount using aggregate pipeline
  const calcTotalAmount = await orderModel.aggregate([
    {
      $match: { _id: newOrder._id },  //match using order id only filter that much this id
    },
    {
      $unwind: "$productID", // unwind product id or deconstract from an array
    },
    {
      $lookup: { 

        from: "products",//join with product collection
        localField: "productID",//unique identifier productID
        foreignField: "_id",
        as: "productDetails",//save the new result as productDetails
      },
    },
    {
      $unwind: "$productDetails", //unwind product details 
    },
    {
      $group: {//group with id
        _id: "$_id",  
        totalAmount: {
          // calculate sum
          $sum: {
            $multiply: [ { $toDouble: "$productDetails.price" },  "$quantity" ], 
            //multiply price with quantity 
          },
        },
      },
    },
  ]);
// loop over the prodcut ..for each product
  let totalAmount =0 ;
  for(let i=0; i< calcTotalAmount.length; i++){
     totalAmount = calcTotalAmount[i].totalAmount ;
  }



 //find and update order
  const updatedOrder = await orderModel.findByIdAndUpdate(
    newOrder._id,
    { totalAmount: totalAmount },
    { new: true }  
  );

 
  //destructure order in good format
  const destructureOrder = (order) => {
    return {
      id: order._id,
      productID: order.productID,
      userID: order.userID,
      totalAmount: order.totalAmount,
      quantity: order.quantity,
      orderStatus: order.orderStatus,
      orderDate: order.orderDate,
    };
  };
//assign in new variable
  const data = destructureOrder(updatedOrder);

  //send response
  res.status(201).json({
    status: "success",
    data: data,
  });
});



exports.cancelOrder = catchAsync(async (req, res, next) => {
   const  orderID=req.params.id
    const order= await orderModel.findById(orderID);
    //  console.log(orderID)
    // console.log(order)

    if(!order){
      return next(new AppError("no order with that id", 404));
    }
    

     if(order.orderStatus === 'cancelled'){
       return next(new AppError(" order cancelled already",400))
     }
     order.save(order.orderStatus === 'cancelled')

  await orderModel.findByIdAndDelete(orderID)


  
    res.status(200).json({
      status: "success",
      message:'order cancelled'
      
    });
  });


  exports.UpdateProduct = catchAsync(async (req, res, next) => {
    const  orderID=req.res.id
      const order= await orderModel.findByIdAndUpdate(orderID,req.body,{
        runValidtor:true,new:true
      });
      
    //  console.log(orderID)
     if(!order){
         next(new AppError ('there is no order with that id',404))
     }
     
   
     res.status(200).json({
       status: "success",
       message:'order updated successfully',
       data:{order}
       
     });
   });