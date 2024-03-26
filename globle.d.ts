namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      PORT: number;
      CORS_ORIGIN: string;
      MONGODB_URI: string;
      ACCESS_TOKEN_EXPIRY: string;
      REFRESH_TOKEN_SECRET: string;
      REFRESH_TOKEN_EXPIRY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_CLOUD_NAME: string;
      EMAIL: string;
      EMAIL_PASSWORD: string;
      HOST_NAME: string;
      EMAIL_PORT: number;
    }
  }
  
  namespace Express {
    interface Request {
      user:{
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
      teacher:{
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
    }
  }
  