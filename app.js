const express=require('express')
const morgan=require('morgan')
const con=require('./Config/DB')
const authorization=require('./middlewares/ahthorization')
const  app=express()
//routes

const productRoutes=require('./routes/productRoutes')
const orderRoutes=require('./routes/orderRoutes')
const userRoutes=require('./routes/userRoutes')
const catagoryRoutes=require('./routes/catagoryRoutes')
const reviewRatingRoute=require('./routes/reviewRatingRoute')

//error handler
const AppError=require('./ErrorHandler/appError')
const globalErrorHandler=require('./ErrorHandler/errorController')



app.use(express.json())

//check environment
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//db connection
con()



app.get('/',(req,res,next)=>{
    res.send('hello server')
  
})
//global authorization

app.use(authorization.protect)

//api routes
app.use('/api/products',productRoutes )
app.use('/api/orders',orderRoutes )
app.use('/api/users',userRoutes )
app.use('/api/catagories',catagoryRoutes )
app.use('/api/reviewRating',reviewRatingRoute )


//global error handling

app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on server`, 404));
    
  });

  app.use(globalErrorHandler)



  module.exports=app