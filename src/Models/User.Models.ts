import mongoose, { Schema, model } from "mongoose"




export type TUser = {
  _id:mongoose.Schema.Types.ObjectId,
  email:string
  name:string
  avatar:string
  userName:string
  password:string
  phoneNumber:number
  sessionToken:string
  refreshToken:string
  forgotPasswordToken:string
  forgotPasswordExpiry:number
  emailVerificationToken:string
  emailVerificationExpiry:number
  role:string
  isAccountFreez:boolean
  accountFreezTime:number
  incorrectPasswordCounter:number
  isAccountBlocked:boolean
  emailVerified:boolean
}
const UserSchema = new Schema<TUser>({
  name:{
  type:String,
  required:true
},
  email:{
  type:String,
  required:true,
  unique:true,
  lowercase:true,
  index:true
},
  userName:{
  type:String,
  required:true,
  index:true,
  
},
  password:{
    type:String,
    required:true
  },
   emailVerified:{
    type:Boolean,
    default:false,
    required:true,

  },
  phoneNumber:{
    type:Number,
    required:true
  },
  sessionToken:{
    type:String,
  },
  refreshToken:{
    type:String
  },
  emailVerificationExpiry:{
    type:Number
  },
  emailVerificationToken:{
    type:String
  },
  forgotPasswordExpiry:{
    type:Number
  },
  forgotPasswordToken:{
    type:String
  },
  isAccountFreez:{
    type:Boolean,
    default:false
  },
  incorrectPasswordCounter:{
    type:Number,
    default:5
  },
  isAccountBlocked:{
    type:Boolean,
    default:false
  },
  accountFreezTime:{
    type:Number,
  },
  role:{
    type:String,
    enum:["STUDENT" , "TEACHER" , "ADMIN" ],
    default:"STUDENT"
  }
},{
  timestamps:true,
})
export const User = model("User" , UserSchema)