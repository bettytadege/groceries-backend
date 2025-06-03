
const mongoose=require('mongoose')
const catagorySchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    catagoryName: {
      type: String,
      // enum:['fruits','vegitable','dairy','snacks','meat'],
      required: [true, "catagory name is required"],
      unique:true,
    },
    // createdAt:{
    //   type:Date.now()
    // }
  },

  { timestamps: true, id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    }, }
);
const catagoryModel=mongoose.model('catagory',catagorySchema)
module.exports=catagoryModel