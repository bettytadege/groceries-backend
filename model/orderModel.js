
const mongoose=require('mongoose');



const orderSchema = mongoose.Schema(
  {
    productID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        required: true,
      },
    ],
    userID: 
    [{
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    }],
    quantity:{
      type:Number,
    },
    orderDate:{
      type:Date,
      default:Date.now()
    },
    orderStatus:{
      type:String,
      enum:['pending','cancelled','delivered'],
      default:'pending'
    },
    totalAmount: { type: Number, id: true,
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
      }, },
  },
  { timestamps: true }
);
const orderModel=mongoose.model('order',orderSchema)
module.exports=orderModel