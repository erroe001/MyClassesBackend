import { Schema, model } from "mongoose";
type TdemoClass = {
  studentId:string
  teacherId:string
  subject:string
  currentClass:string
  status:string
}



const democlassSchema = new Schema<TdemoClass>({
  studentId:{
    type:String,
    required:true,
    ref:"User"
  },
  teacherId:{
    type:String,
    required:true,
    ref:"User"
  },
  subject:{
    type:String,
    required:true,
  },
  currentClass:{
    type:String
  },
  status:{
    type:"String",
    enum:["PENDING" , "SUCCESS" , "CENCELLED"],
    default:"PENDING"
  }
},
{
  timestamps:true
})

export const Demo = model("Demo" , democlassSchema)