import mongoose, { Schema, model } from "mongoose"
type TReffral = {
  _id:mongoose.Schema.Types.ObjectId
  reffralBy:string,
  reffred:string
}
const ReffralSchem = new Schema<TReffral>({
  reffralBy:{
    type:String,
    ref:"User",
  },
  reffred:{
    type:String,
    ref:"User",
  }
},{
  timestamps:true
}) 
export const Reffral = model("Reffral" , ReffralSchem)