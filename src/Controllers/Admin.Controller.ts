import { toASCII } from "punycode";
import { Teacher } from "../Models/Teacher.Models";
import { User } from "../Models/User.Models";
import { hashPassword } from "../Utilities";
import { asyncHandler } from "../Utilities/AsyncHandler";
import { ApiErrorResponse, ApiSuccessResponse } from "../Utilities/Responses";
export const RegisterAdmin = asyncHandler(async(req,res,next)=>{
  try {
    const { email , name , phone }= req.body
    try {
      const UUID = crypto.randomUUID().split("-")
      const password = await hashPassword(UUID[0])
      const newUser = await User.create({
        email,
        name , 
        password,
        userName:UUID[4],
        phoneNunber:phone,
        role:"ADMIN"
      })
      await newUser.save()
    } catch (error:any|unknown) {
      if(error.code)throw new ApiErrorResponse(402 , "Email or phone already exist")
    }
  } catch (error) {
    next(error)
  }
})
export const unverifiedTeachers = asyncHandler(async(req,res,next)=>{
  try {
    const allTeachers = await Teacher.aggregate([
      {$match:{status:"PENDING"}},
      {$lookup:{
        from:"users",
        localField:"userName",
        foreignField:"userName",
        as:"Teachers"
      }},
      {$addFields:{Teachers:{$first:"$Teachers"}}},
      {$project:{
        Teachers:{
          avatar:1,
          name:1,
          phoneNunber:1,
        }
      }}
    ]) 
    if(allTeachers.length === 0) throw new ApiErrorResponse(404 , "No Teacher is found")
    ApiSuccessResponse(res , 200 , "Successfully Found " , allTeachers)
  } catch (error) {
    next(error)
  }
})
export const VerifyTeacher = asyncHandler(async(req,res,next)=>{
 try {
   const {teacherId , status}= req.body
   if(status !== "SUCCESS") throw new ApiErrorResponse(400 , "Not valid paramiters")
  const isTeacherUpdated =  await Teacher.findOneAndUpdate({$and:[{teacherId}] } , {$set:{status}} , {new:true})
   if(!isTeacherUpdated)throw new ApiErrorResponse(500 ,"Details not updated")
   ApiSuccessResponse(res ,200 , "Teacher verified successfully ")
 } catch (error) {
  next(error)
 }
})
export const blockUser = asyncHandler(async(req,res,next)=>{
  try {
    const {userId}= req.body
    if(!userId){
      throw new ApiErrorResponse(400  , "Please provide the user id  ")
    }
    const isUserBlocked = await User.findOneAndUpdate({userName:userId} , {$set:{isAccountBlocked:true}} , {new:true})
    if(!isUserBlocked)throw new ApiErrorResponse(404 , "User not found to block")
    ApiSuccessResponse(res , 200 ,"Successfully blocked a user ")
  } catch (error) {
    next(error)
  }
})
// export const allStudentsSignup



export const setYoutubeVideoLink = asyncHandler(async(req,res,next)=>{
  // set the youtube link to the teacher 

})
export const connectUserToTeacher = asyncHandler(async(req,res,next)=>{

})

export const totalTeacherRegisterd= asyncHandler(async(req,res,next)=>{
  try {
    const totalTeacher = await Teacher.find({status:"SUCCESS"})
    if(totalTeacher.length === 0) throw new ApiErrorResponse(404 , "No teacher found ")
    ApiSuccessResponse(res , 200 , "found" , totalTeacher.length)
  } catch (error) {
    next(error)
  }
})
export const totalStudentinWebsite =asyncHandler(async(req,res,next)=>{
try {
    const totalStudents = await User.find({role:"STUDENT"})
  if(totalStudents.length === 0) throw new ApiErrorResponse(404 , "No Student found in our website")
  ApiSuccessResponse(res , 200 , "found" , totalStudents.length)
} catch (error) {
  next(error)
}
})



export const getAllUnVerifyedTeacher = asyncHandler(async(req,res,next)=>{
 try {
  const unverifyedTeachers =  await Teacher.aggregate([
 
     {
       $match:{
         status:"PENDING"
       }
     },
     {
      $sort:{
        createdAt:-1
      }
     },
     {
       $lookup:{
         from:"users",
         localField:"teacherId",
         foreignField:"userName",
         as:"Teachers"
       }
     },
     {
       $addFields:{
         Teachers:{$first:"$Teachers"},
         
       }
     },
     {
       $project:{
         teacherId:1,
         videoLink:1,
         description:1,
         qualification:1,
         subjectTeaching:1,
         completeAddress:1,
         locality:1,
         status:1,
         teachingExperience:1,
         Teachers:{
           email:1,
           name:1,
           avatar:1,
           userName:1,
           password:1,
           phoneNunber:1
         }
       }
     }
     
   ])
 
   if(unverifyedTeachers.length === 0){
     throw new ApiErrorResponse(404 , "No teacher found")
   }
   ApiSuccessResponse(res , 200 , "found" , unverifiedTeachers)
 
 } catch (error) {
  next(error)
 }


})
