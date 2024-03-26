



import { ApiErrorResponse, ApiSuccessResponse,globleErrorHandler } from './Utilities/Responses'
import expres from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { removeAllFiles, removeFile } from './Middleware/Multer.Middleware'
import path from 'path'








export const App = expres()
App.use(expres.static(path.resolve("./Public")))
App.use(expres.json())
App.use(expres.urlencoded({extended:false}))

//

App.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
App.use(cookieParser())

dotenv.config({
    path:".env"
})








App.listen(process.env.PORT , ()=>{
    console.log("Successfully Started")
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDb connected")
    } catch (error) {
        console.log(error)
    }
})
import UserRouter from './Routes/User.Routes'
import StudentRouter from './Routes/Student.Route'
import AdminRouter from './Routes/Admin.Routes'
import TeacherRouter from './Routes/Teacher.Routes'
import mongoose from 'mongoose'





App.use("/api/v1/user" , UserRouter)
App.use("/api/v1/student" , StudentRouter)
App.use("/api/v1/admin" , AdminRouter)
App.use("/api/v1/teacher" , TeacherRouter)


App.use(globleErrorHandler)