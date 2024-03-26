




import mongoose, { Schema, model } from 'mongoose'
import { GENDER_ENUM } from './Constraints'
export type TStudentSchema = {
  studentId:string
  currentClass:string
  gender:string
  reffralId:string
}
export type TInquary= {
  _id:mongoose.Schema.Types.ObjectId,
  student:string
  teacher:string
  status:string
}
const StudentSchema = new Schema<TStudentSchema>({

  studentId:{
    type:String,
    ref:"User",
    index:true
  },
  reffralId:{
    type:String,
    required:true
  },
  currentClass:{
    type:String,
  required:true
  },
  gender:{
    type:String,
    enum:GENDER_ENUM
  },
},{
  timestamps:true,
})
const inquaryFromStudent = new Schema<TInquary>({
student:{
  type:String,
  ref:"User"
},
teacher:{
  type:String,
  ref:"Teacher"
},
status:{
  type:"String",
  enum:["PENDING" , "DONE" , "REJECTED"]
}
})
export const Student = model("Student" , StudentSchema)
export const Inquary = model("Inquary" , inquaryFromStudent)