





import express from 'express'
import { RegisterTeacherValidator } from '../Validator/Teacher.validator'
import { validateErrors } from '../Validator/validate'
import { RegisterTeacher, checkStudentEnroll, updateDetailsTeacher } from '../Controllers/Teacher.Controllers'
import { UserAuthCheck, teacherAuthCheck } from '../Middleware/AuthCheck.Middleware'
import { checkReffralsUsers } from '../Controllers/Student.Controller'


const Router = express.Router()




Router.route("/register").post(RegisterTeacherValidator(), validateErrors , RegisterTeacher)
Router.route("/check/enroll/students").get(teacherAuthCheck , checkStudentEnroll)
Router.route("/update/details").patch(teacherAuthCheck ,updateDetailsTeacher )


export default Router
