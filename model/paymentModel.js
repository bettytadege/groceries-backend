
const mongoose=require('mongoose')

const paymentSchema = mongoose.Schema(
    {
    productID:{
        type:mongoose.Schema.ObjectId,
        ref:"product",
        required:true
      },
      userID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
      },
      totalAmount:{
        type:Number
      }
    }
,{  timestamps: true , id: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },});
const paymentModel=mongoose.model('payment',paymentSchema)
module.exports=paymentModel