import mongoose, { Schema, model } from "mongoose";
export type TteacherType = {
  teacherId:string
  videoLink:string[]
  description:string
  qualification:string
  subjectTeaching:string[]
  completeAddress:string
  locality:string
  status:string
  reason:string
  teachingExperience:string
}
export type Tadmission = {
  _id:mongoose.Schema.Types.ObjectId,
  teacher:string,
  student:string,
  streem:string,
  subject:string,
  status:string
}
const TeacherSchema = new Schema<TteacherType>({
  teacherId:{
    type:"String",
    ref:"User"
  },
  description:{
    type:String,
    required:true
  },
  qualification:{
    type:String,
    required:true
  },
  subjectTeaching:{
    type:[String],
    required:true
  },
  locality:{
    type:String ,
     required:true
  },
  completeAddress:{
    type:String , 
    required:true
  },
  status:{
    type:"String",
    enum:["SUCCESS" , "REJECTED" , "PENDING"],
    default:"PENDING"
  },
  teachingExperience:{
    type:String,
  },
  reason:{
    type:String,
  },
},
{
  timestamps:true
})
const admissionSchema = new Schema<Tadmission>({
 teacher:{
  type:String,
  ref:"Teacher"
 } ,
 student:{
  type:String,
  ref:"User"
 },
 streem:{
  type:String,
 },
 subject:{
  type:String,
 },
 status:{
  type:"String",
  enum:["DONE" , "CENCELLED"]
 }

})
export const Teacher = model("Teacher" , TeacherSchema)
export const Admission= model("Admission" , admissionSchema)