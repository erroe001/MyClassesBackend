import { Document } from "mongoose";
import { Inquary, Student } from "../Models/Student.Models";
import { generateSessionTokens, generateVerificationTokens, hashPassword, isValidPassword } from "../Utilities";
import { asyncHandler } from "../Utilities/AsyncHandler";
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from "../Utilities/Responses";
import crypto from 'crypto'
import { TUser, User } from "../Models/User.Models";
import { Teacher } from "../Models/Teacher.Models";
export const registerAStudent = asyncHandler(async(req,res,next)=>{
  try {
    const { email , name , phoneNumber , currentClass , reffralId } = req.body
    const isUserAlreadyExist = await User.findOne({userName:reffralId})
    if(!isUserAlreadyExist) throw new ApiErrorResponse(404 , "Reffral not found")
    try {
      const UUID = crypto.randomUUID().split("-")
      const password = await hashPassword(UUID[0])
      const newUser = await User.create({
        email ,
        name ,
        phoneNumber,
        currentClass ,
        userName:UUID[4],
        password
      })
      const newStudent = await Student.create({
        studentId:newUser.userName,
        currentClass,
        reffralId:reffralId
      })

      const {hashedToken , unhashedToken , tokenExpiry} = await generateVerificationTokens()
      newUser.emailVerificationToken = hashedToken
      newUser.emailVerificationExpiry = tokenExpiry
      await newUser.save()
      await newStudent.save()
      ApiSuccessResponse(res , 200 , "Student Registration Success" , [UUID[0] , UUID[4] , unhashedToken])
    } catch (error:any) {
      if(error.code){
        if(error.keyPattern.email){
          throw new ApiErrorResponse(400 , "Email already exist with us")
        }
        throw new ApiErrorResponse(400 , "Phone already exist with us")
      }
      throw new ApiErrorResponse(400 , error)
    }
  } catch (error) {
    next(error)
  }
})
export const StudentLogin = asyncHandler(async(req,res,next)=>{
  try {
    const {email , password}= req.body
      const isStudentFound = await User.findOne({$or:[{email} , {userName:email}]}).select(" -sessionToken -refreshToken -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry    ")
    if(!isStudentFound){
      throw new ApiErrorResponse(404 , "No Student Found With this details")
    }
    if(isStudentFound.role !== "STUDENT")throw new ApiErrorResponse(400 , "You are not able to login in student site")
    if(isStudentFound.isAccountBlocked){
      throw new ApiErrorResponse(401 , "Your Account is Blocked please contact our team")
    }
    if(isStudentFound.isAccountFreez === true && isStudentFound.accountFreezTime > Date.now()){
      throw new ApiErrorResponse(401 , "Your account freezed try again 24 hours for security purpose ")
    }
    const isPasswordValid =await isValidPassword(password , isStudentFound.password)
    if(!isPasswordValid){
      if(isStudentFound.incorrectPasswordCounter === 0){
        isStudentFound.isAccountFreez = true
        await isStudentFound.save({validateBeforeSave:false})
        throw new ApiErrorResponse(400 , "Your account is freez due to multiple incorrect password tries")
      }
      if(isStudentFound.incorrectPasswordCounter > 0){
        isStudentFound.incorrectPasswordCounter -=1
        await isStudentFound.save({validateBeforeSave:false})
        throw new ApiErrorResponse(400 , `Your Password is incorrect ${isStudentFound.incorrectPasswordCounter} tries left` )
      }
    }
    const {refreshToken , sessionToken }=await generateSessionTokens(isStudentFound)
    isStudentFound.sessionToken = sessionToken
    isStudentFound.refreshToken = refreshToken
    isStudentFound.incorrectPasswordCounter = 5
    await isStudentFound.save({validateBeforeSave:false})
    return res
    .cookie("accessToken" , sessionToken)
    .cookie("refreshToken" , refreshToken)
    .json(new ApiResponse(200 , "Login successfully Done " , isStudentFound))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// export const checkOwnDetails= asyncHandler(async(req,res,next)=>{
//  try {
//    const student = req.user as Document<unknown> & TUser
//    const selectedOptions = {
//      _id:student._id,
//      email:student.email,
//      name:student.name,
//      userName:student.userName,
//      currentClass:student.currentClass,
//      phoneNunber:student.phoneNunber,
//    }
//    ApiSuccessResponse(res , 200 , "Successfully Fetch user details" , selectedOptions)
//  } catch (error) {
//   next(error)
//  }
// })
export const checkReffralsUsers = asyncHandler(async(req,res,next)=>{
  try {
    const  user= req.user as Document<unknown> & TUser
    const reffralUsers = await Student.find({reffralId:user.userName}).select("-password -sessionToken -refreshToken -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry -isAccountFreez -accountFreezTime -incorrectPasswordCounter -isAccountBlocked")
    if(reffralUsers.length=== 0){
      throw new ApiErrorResponse(404 , "You haven't reffered any people")
    }
    ApiSuccessResponse(res , 200 , "Successfully Found" , reffralUsers)
  } catch (error) {
    next(error)
  }
})
// 1 limit 10 

export const showTeachers = asyncHandler(async(req,res,next)=>{
  try {
    const {limit = 10 , page=1} = req.query
    if(typeof +limit !== "number" && typeof +page !== "number"){
      throw new ApiErrorResponse(400 , "Please provide the valid in number")
    }

   const Teachers =  await User.aggregate([
      {
        $match:{
        role:"TEACHER"
        }
      },
      {
        $lookup:{
          from:"teachers",
          localField:"userName",
          foreignField:"teacherId",
          as:"Teacher",
          pipeline:[
            {
              $match:{
                status:"SUCCESS"
              },
            }
          ]
        }
      },
      {
        $addFields:{
          Teacher:{$first:"$Teacher"}
        }
      },
      {
        $project:{
         email:1,
         name:1,
         avatar:1,
         userName:1,
         phoneNumber:1,
         Teacher:1,
        }
      },
      {
        $addFields:{
          Teacher:{
            status:0,
            reason:0
          }
        }
      }

     
    ]).skip((+page - 1) * (+limit)).limit(+limit)

    if(Teachers.length === 0){
      throw new ApiErrorResponse(404,"No Teacher Found")
    }
    ApiSuccessResponse(res , 200, "Teacher Found" , Teachers)
  } catch (error) {
    next(error)
  }
})
export const applyForTeacherInquary  = asyncHandler(async(req,res,next)=>{
  try {
    const student = req.user
    const { teacherId }= req.body as {teacherId:string}
   const isTeacherFound =  await User.findOne({ $and:[{username:teacherId} , {role:"TEACHER"}] })
   if(!isTeacherFound) throw new ApiErrorResponse(404 , "Teacher not found ")
    const newInquary = await Inquary.create({
  student:student.userName,
  teacher:isTeacherFound.userName
  })
  await newInquary.save()
  ApiSuccessResponse(res , 200 , "Successfully Quary Submited")
  } catch (error) {
    next(error)
  }
})
export const searchTeacher = asyncHandler(async(req,res ,next)=>{
 try {
   const {quary} = req.query
   if(!quary){
     throw new ApiErrorResponse(400 , "Please provide the valid quary")
   }
  // const foundTeacher=  await User.aggregate([
  //   {
  //     $match:{
  //       userName:{ $regex:quary, $options: 'i'},
        
  //       role:"TEACHER"
  //     }
  //   },
  //   {
  //     $lookup:{
  //       from:"teachers",
  //       localField:"userName",
  //       foreignField:"teacherId",
  //       as:"Teacher",
  //       pipeline:[
  //         {
  //           $match:{
  //             status:"SUCCESS",

  //           },
  //         }
  //       ]
  //     }
  //   },
  //   {
  //     $addFields:{
  //       Teacher:{$first:"$Teacher"}
  //     }
  //   },
  //   {
  //     $project:{
  //      email:1,
  //      name:1,
  //      avatar:1,
  //      userName:1,
  //      phoneNumber:1,
  //      Teacher:1,
  //     }
  //   },
  //   {
  //     $addFields:{
  //       Teacher:{
  //         status:0,
  //         reason:0
  //       }
  //     }
  //   }

  //  ])
   const foundSearchTeacher = await Teacher.aggregate([
    {
      $match:{
        userName:{ $regex:quary, $options: 'i'},
        locality:{ $regex:quary, $options: 'i'},
        role:"TEACHER"
      }
    }
   ])
   if(foundSearchTeacher.length === 0) throw new ApiErrorResponse(404 , "No Teacher Found ")
   ApiSuccessResponse(res , 200 , "Teacher found Teacher " , foundSearchTeacher)
 } catch (error) {
  next(error)
 }
})

export  const studentAppliedTeachers  = asyncHandler(async(req,res,next)=>{
  try {
    const student = req.user
    if(student.role!== "STUDENT") throw new ApiErrorResponse(401 , "You are not able to check because you are not student ")
    const allInquary = await Inquary.find({student:student.userName})
    if(allInquary.length === 0) throw new ApiErrorResponse(404 , "You haven't apply for any teacher ")
    ApiSuccessResponse(res , 200 , "Successfully Found" , allInquary)
  } catch (error) {
    next(error)
  }
})

export const demoClassBook = asyncHandler(async(req,res,next)=>{
  const {TeacherId} = req.body
  

})






