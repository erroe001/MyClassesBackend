import { Document, Schema } from "mongoose";
import { Inquary, Student, TStudentSchema } from "../Models/Student.Models";
import { generateSessionTokens, generateVerificationTokens, hashPassword, isValidPassword, unhashedToHashed } from "../Utilities";
import { asyncHandler } from "../Utilities/AsyncHandler";
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from "../Utilities/Responses";
import crypto from 'crypto'
import jsonwebToken from 'jsonwebtoken'
import { Teacher } from "../Models/Teacher.Models";
import { TUser, User } from "../Models/User.Models";
import { deleteImagefromCloudinary, uploadImageinCloudinary } from "../Utilities/Cloudinary.util";


export const logoutUser = asyncHandler(async(req,res ,next)=>{
  try {
    const student = req.user  as Document<unknown> & TUser
    student.sessionToken = ""
    student.refreshToken = ""
    await student.save({validateBeforeSave:false})
    return res.clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200 , "Logout successfully done"))
  
  } catch (error) {
    next(error)
  }
})
export const updateDetails = asyncHandler(async(req, res , next)=>{
  try {
    const student = req.user as Document<unknown> & TUser
    const {name ,currentClass , parentsNumber}= req.body as {
      name?:string,
      currentClass?:string,
      parentsNumber?:number
    }
    if(!(name || currentClass|| parentsNumber)){
      throw new ApiErrorResponse(400 , "Please provide atleast one value to update")
    }
    const studentDetails = await Student.findOne({studentId:student.userName})
    if(!studentDetails) throw new ApiErrorResponse(400  ,"Student not found ")
    name && (student.name = name )
    currentClass && (studentDetails.currentClass = currentClass )
    await student.save({validateBeforeSave:false})
    ApiSuccessResponse(res , 200 , "Update changes successfully done!")
  } catch (error) {
    next(error)
  }
})
export const forgotPasswordDirectly = asyncHandler(async(req,res,next)=>{
  const student = req.user as  Document<unknown> & TUser
  try {
    const {oldPassword , newPassword}= req.body
    if(!(oldPassword && newPassword)){
      throw new ApiErrorResponse(400 , "Please provide all the required details ")
    }
    const isPasswordValid =await isValidPassword(oldPassword , student.password)
    if(!isPasswordValid){
      if(student.incorrectPasswordCounter === 0){
        student.isAccountFreez = true
        await student.save({validateBeforeSave:false})
        res.status(400).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(400 , "Account Freezed "))
      }
      if(student.incorrectPasswordCounter > 0){
        student.incorrectPasswordCounter -=1
        await student.save({validateBeforeSave:false})
        throw new ApiErrorResponse(400 , `Your Password is incorrect ${student.incorrectPasswordCounter} tries left` )
      }
    }
    const password = await hashPassword(newPassword)
    student.password = password
    student.incorrectPasswordCounter = 5
   await student.save({validateBeforeSave:false})
   ApiSuccessResponse( res,200 , "Password changed successfully done ")
  } catch (error) {
    next(error)
  }
})
export const generateEmailVerificationTokens  = asyncHandler(async(req,res , next)=>{
  const student  = req.user as Document & TUser
try {
  
  const {hashedToken , tokenExpiry ,unhashedToken} = await generateVerificationTokens()
   student.emailVerificationToken = hashedToken
   student.emailVerificationExpiry = tokenExpiry
   await student.save({})
   ApiSuccessResponse(res , 200 , "Please check your email " , {unhashedToken})
} catch (error) {
  next(error)
  
}


})
export const verifyEmail = asyncHandler(async(req,res , next)=>{
  try {
    const {token , email} = req.params
    const hashedToken = await unhashedToHashed(token)
    if(!hashedToken){
      throw new ApiErrorResponse(400 , "Please check the paramiters")
    }
   const isEmailVerifyed=  await User.findOneAndUpdate(
      {
      $and:[
        {email},
        {emailVerified:false},
        {emailVerificationToken:hashedToken},
        {emailVerificationExpiry:{$gt:Date.now()}}
      ]
    },
    {
  $set:{emailVerified:true , emailVerificationToken:""}
    },
    {
      new:true
    }
    )
  
    if(!isEmailVerifyed){
      throw new ApiErrorResponse(404 , "Email Already Verifyed or provided value are not correct ")
    }
    ApiSuccessResponse(res ,  200 , "Successfully verifyed the email")
  } catch (error) {
    next(error)
    
  }
})
export const changeUserEmail =asyncHandler(async(req,res,next)=>{
  try {
    const user = req.user as Document<unknown> & TUser
    const {newEmail , password} = req.body
    if(!(newEmail && password)){
      throw new ApiErrorResponse(400  , "Please fill all the required details ")
    }
   const hashedPassword = await hashPassword(password)
    if(hashedPassword !== user.password){
      throw new ApiErrorResponse(400 , "Incorrect password provided")
    }
    const isEmailFound = await User.findOne({email:newEmail})
    if(isEmailFound){
      throw new ApiErrorResponse(401 , "This email is already exist with us ")
    }
    user.email = newEmail
    await user.save({validateBeforeSave:false})
    ApiSuccessResponse(res , 200 , "Successfully Email Changed ")
  } catch (error) {
    next(error)
  }
})
export const generatePasswordResetTokens = asyncHandler(async(req,res,next)=>{
  try {
    const {email} = req.body 
    const isUserFound = await User.findOne({email} )
    if(!isUserFound){
      throw new ApiErrorResponse(404 , "From this email user not found")
    }
    if(isUserFound.emailVerified === false){
      throw new ApiErrorResponse(400 , "You are not able to change your password because your email is not verified please contact to our team ")
    }
    const { hashedToken , tokenExpiry ,unhashedToken}= await generateVerificationTokens()
    isUserFound.forgotPasswordToken = hashedToken
    isUserFound.forgotPasswordExpiry = tokenExpiry
    await isUserFound.save({validateBeforeSave:false})
    ApiSuccessResponse(res , 200 , "Email send please check and reset your password" , unhashedToken)
  } catch (error) {
    next(error)
  }
})
export const changePasswordFromEmailLink = asyncHandler(async(req,res , next)=>{
  try {
    const {token , email} =req.params
    const {newPassword}= req.body
    const hashedPassword = await hashPassword(newPassword)
    const hashedToken= await unhashedToHashed(token) 
    // also we have an option to  check the  
   const isPasswordChenged =  await User.findOneAndUpdate({$and:[
      {email},
      {forgotPasswordToken:hashedToken},
      {forgotPasswordExpiry:{$gt:Date.now()}},
    ]},
    {
      $set:{password:hashedPassword , forgotPasswordToken:""}
    },
  {
    new:true
  }
    )
    if(!isPasswordChenged){
      throw new ApiErrorResponse(404 , "User not found or link expired ")
    }
    ApiSuccessResponse(res, 200 , "Successfully reset your password")
  } catch (error) {
    next(error)
  }
})

export const getNewAccessToken= asyncHandler(async(req,res,next)=>{
  try {
    const studentRefreshToken = req.body.studentRefreshToken as string
    if(!studentRefreshToken){
      throw new ApiErrorResponse(400,"Please Login ")
    }
    const {id} = jsonwebToken.verify(studentRefreshToken , process.env.REFRESH_TOKEN_SECRET)  as {
      id:string
    }
    if(!id){
      res.clearCookie("refreshToken")
      throw new ApiErrorResponse(400 , "Refresh token not valid")
    }
    const foundStudent = await User.findOne({_id:id})
    if(!foundStudent){
      throw new ApiErrorResponse(404 , "Student not found or student Deleted")
    }
    if(foundStudent.isAccountBlocked){
      throw new ApiErrorResponse(401 , "Your account was blocked please contact to our support")
    }
    const {refreshToken , sessionToken}= await generateSessionTokens(foundStudent)
    foundStudent.refreshToken = refreshToken
    foundStudent.sessionToken = sessionToken
    await foundStudent.save({validateBeforeSave:false})
    res.cookie("accessToken" , sessionToken).cookie("refreshToken" , refreshToken).json(new ApiResponse(200  , "Successfully generated "))
    
  } catch (error) {
   next(error)
  }
})
export const setNewAvatar = asyncHandler(async(req,res,next)=>{
  const user = req.user as Document<unknown> & TUser

  if(!req.file?.path){
    throw new ApiErrorResponse(400 , "Please provide the image that you want to set ")
  }
  const localPath = req.file.path
  if(!user.avatar){
    const uploadedImageUrl = await uploadImageinCloudinary(localPath)
    if(uploadedImageUrl !== null){
      user.avatar = uploadedImageUrl.url
      await user.save({validateBeforeSave:false})
      return res.json(new ApiResponse(200 , "Successfully uploaded"))
    }
  }
  const userExistingImageUrl = user.avatar.split("/").at(7)?.split(".").at(0)
  if(userExistingImageUrl!== undefined){
    const isDeleted = await deleteImagefromCloudinary(userExistingImageUrl)

    if(isDeleted){
     const uploadedImage =  await uploadImageinCloudinary(localPath)
     if(uploadedImage !== null){
       user.avatar= uploadedImage.url
       await user.save({validateBeforeSave:false})
       return res.json(new ApiResponse(200 , "Successfully Uploaded "))
     }
     throw new ApiErrorResponse(400 , "This image is not uploaded")
    }
  }
})




