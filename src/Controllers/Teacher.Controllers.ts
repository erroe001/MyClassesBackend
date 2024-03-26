import { Admission, Teacher, TteacherType } from "../Models/Teacher.Models";
import { hashPassword } from "../Utilities";
import { asyncHandler } from "../Utilities/AsyncHandler";
import crypto from 'crypto'
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from "../Utilities/Responses";
import { Document } from "mongoose";
import { TUser, User } from "../Models/User.Models";
import { uploadImageinCloudinary } from "../Utilities/Cloudinary.util";
export const RegisterTeacher = asyncHandler(async(req,res,next)=>{
  try {
    const {email ,completeAddress , description,locality, phone , qualification , subjectTeaching   } = req.body 
    // file required name is avatar
    
    try {
      if(!req.file?.path){
        throw new ApiErrorResponse(400 , "Please provide the image")
      }
      const teacherAvatar = req.file.path
      const uploaedImage=  await uploadImageinCloudinary(teacherAvatar)

      const UUID = crypto.randomUUID().split("-")
      const password = await hashPassword(UUID[0])
      const newUser = await User.create({
        userName:UUID[4],
        password,
        email,     
        avatar:uploaedImage?.url,
        phoneNunber:phone,
        role:"TEACHER"
      })
      const newTeacher = await Teacher.create({
        teacherId:newUser.userName,
        completeAddress,
         description,
         locality,
         qualification,
         subjectTeaching
      })
      await newUser.save()
      await newTeacher.save()
      ApiSuccessResponse(res , 200  ,"Signup successfully done wait for 48-72 hours to verify")
    } catch (error:any|unknown) {
      if(error.code) throw new ApiErrorResponse(200 , error)
    }
  } catch (error) {
    next(error)
  }
})
export const checkStudentEnroll = asyncHandler(async(req,res,next)=>{
  try {
    const teacher = req.user
    const EnrollStudents = await Admission.find({$and:[{teacher:teacher.userName} , {status:"DONE"}]})
    if(EnrollStudents.length === 0) throw new ApiErrorResponse(404 , "No enroll students found ")
    ApiSuccessResponse(res , 200 , "Successfully found" , EnrollStudents)
  } catch (error) {
    next(error)
  }
})
export const updateDetailsTeacher = asyncHandler(async(req, res , next)=>{
  try {
    const teacher = req.user as Document<unknown> & TUser
    const AnotherTeacherDetails = await Teacher.findOne({teacherId:teacher.userName})
    if(!AnotherTeacherDetails) throw new ApiErrorResponse(404  , "Teacher details not found")

    const {completeAddress , description , locality, name}= req.body as {
      name?:string,
      description?:string,
  locality?:string,
  completeAddress?:string
    }
    if(!(name || completeAddress|| description || locality)){
      throw new ApiErrorResponse(400 , "Please provide atleast one value to update")
    }
    name && (teacher.name = name)
    description && (AnotherTeacherDetails.description = description )
    locality && (AnotherTeacherDetails.locality = locality )
    completeAddress && (AnotherTeacherDetails.completeAddress = completeAddress )
    await AnotherTeacherDetails.save({validateBeforeSave:false})
    ApiSuccessResponse(res , 200 , "Update changes successfully done!")
  } catch (error) {
    next(error)
  }
})








