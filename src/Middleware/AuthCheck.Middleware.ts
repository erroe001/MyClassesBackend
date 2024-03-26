import { Student } from "../Models/Student.Models";
import { Teacher } from "../Models/Teacher.Models";
import { User } from "../Models/User.Models";
import { asyncHandler } from "../Utilities/AsyncHandler";
import { ApiErrorResponse } from "../Utilities/Responses";
import jsonwebtoken from 'jsonwebtoken'


export const UserAuthCheck = asyncHandler(async(req,res,next)=>{
 try {
   const accessToken = req.cookies.accessToken
   if(!accessToken) throw new ApiErrorResponse(401 , "Unauthorized access")
   const {userName} = jsonwebtoken.verify(accessToken , process.env.ACCESS_TOKEN_SECRET) as {userName:string , email:string ,role:string}
     if(!userName){
     res.clearCookie("accessToken").clearCookie("refreshToken")
     throw new ApiErrorResponse(401 , "Access token invalid")
   }
   const foundUser = await User.findOne({userName})
   if(!foundUser) {
     res.clearCookie("accessToken").clearCookie("refreshToken")
     throw new ApiErrorResponse(404 , "No User found")
   }
   if(foundUser.isAccountBlocked){ 
     res.clearCookie("sessionToken")
     throw new ApiErrorResponse(401 , "User blocked please contact to our team to unblock your account")
   }
   req.user = foundUser
   next()
   
 } catch (error) {
  next(error)
 }

})




export const teacherAuthCheck = asyncHandler(async(req,res,next)=>{
  try{
  const accessToken = req.cookies.sessionToken
   if(!accessToken) throw new ApiErrorResponse(401 , "Unauthorized access")
   const {userName} = jsonwebtoken.verify(accessToken , process.env.ACCESS_TOKEN_SECRET) as {userName:string , email:string ,role:string}
     if(!userName){
     res.clearCookie("sessionToken").clearCookie("refreshToken")
     throw new ApiErrorResponse(401 , "Access token invalid")
   }
   const foundUser = await Teacher.findOne({userName})
   if(!foundUser) {
     res.clearCookie("accessToken").clearCookie("refreshToken")
     throw new ApiErrorResponse(404 , "No User found")
   }
   if(foundUser.status !== "SUCCESS"){ 
     res.clearCookie("sessionToken")
     throw new ApiErrorResponse(401 , "Your Account is still not verifyed")
   }
   req.teacher = foundUser
   next()
 } catch (error) {
  next(error)
 }
})


