
const mongoose=require('mongoose')

const reviewRatingSchema = mongoose.Schema({
  review: {
    type: String,
  },
  productDetail: {
    type: String,
  },
  productID: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
    required:true
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required:true
  },
  rating: {
    type: Number,
  },
  averageRating:{  type: Number},

 
}
, { timestamps: true , id: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },});
const reviewRating=mongoose.model('reviewRating',reviewRatingSchema)
module.exports=reviewRating