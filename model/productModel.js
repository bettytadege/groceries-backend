
const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    productName:{
        type:String,
        required:[true,'product name is required'],
        unique:true,
    },
    productDetail:{
        type:String,
       
    },
    productImage:{
        type:[String]
    },
    price:{
        type:String,
        required:[true,'price tag is required']
    },
    productStatus:{
        type:Boolean,
        default:false,
    },
    catagoryID:{
        type:mongoose.Schema.ObjectId,
        ref:"catagory",
        required:true
      },
   
   

},{ timestamps: true , id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },})
const productModel=mongoose.model('products',productSchema)
module.exports=productModel