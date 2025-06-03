const AppError = require('../ErrorHandler/appError')
const catchAsync = require('../ErrorHandler/catchAsync')
const reviewModel=require('../model/reviewAndRatingModel')

exports.createReview=catchAsync (async(req,res,next)=>{
  const userId=req.id
 const review= await reviewModel.create(req.body)

  res.status(201).json({
    status:'success',
    message:'review created successfully',
    data:{
        review,
    }
  })

})

exports.getAverageRating = catchAsync(async (req, res, next) => {
  const productId = req.params.productId; 

  
  const result = await reviewModel.aggregate([
    {
      $match:{id:productId}
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" }, 
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result)

 
  if (result.length === 0) {
    return next(new AppError("No ratings found for this product",404))
    
  }


  res.status(200).json({
    status: "success",
    data: {
      productId: result[0]._id,
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    },
  });
});
;