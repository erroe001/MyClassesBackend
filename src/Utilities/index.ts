import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { TStudentSchema } from '../Models/Student.Models'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { TUser } from '../Models/User.Models'
export const hashPassword = async(password:string)=>{
  return   bcrypt.hashSync(password , 10)
}
export const isValidPassword = async(password:string , hashPassword:string)=>{
  return  bcrypt.compareSync(password , hashPassword) 
}
export const generateSessionTokens = async(student:TUser):Promise<{
  sessionToken:string
  refreshToken:string
}>=>{
  const sessionToken = jsonwebtoken.sign({userName:student.userName , email:student.email , role:student.role} , process.env.ACCESS_TOKEN_SECRET)
  const refreshToken = jsonwebtoken.sign({id :student._id} , process.env.REFRESH_TOKEN_SECRET)
  return {sessionToken , refreshToken}
}


export const generateVerificationTokens = async():Promise<{
  unhashedToken: string;
  hashedToken: string;
  tokenExpiry: number;
}>=>{
  const unhashedToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha-256")
    .update(unhashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 10 * 60 * 1000;
  return { unhashedToken, hashedToken, tokenExpiry };
}


export const unhashedToHashed = async(unhashedToken:string)=>{
  const hashedToken = await crypto.createHash("sha-256").update(unhashedToken).digest("hex")
  return hashedToken
}