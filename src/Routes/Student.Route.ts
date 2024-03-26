



import express from 'express'
import { register } from 'module'
import { RegisterStudentValidator, StudentLoginValidator } from '../Validator/Student.validator'
import { validateErrors } from '../Validator/validate'
import { StudentLogin, applyForTeacherInquary, checkReffralsUsers, registerAStudent, searchTeacher, showTeachers, studentAppliedTeachers } from '../Controllers/Student.Controller'
import { UserAuthCheck } from '../Middleware/AuthCheck.Middleware'


const Router = express.Router()




Router.route("/register").post(RegisterStudentValidator() , validateErrors , registerAStudent)
Router.route("/login").patch(StudentLoginValidator() , validateErrors , StudentLogin)
Router.route("/check/reffral").get(UserAuthCheck , checkReffralsUsers)
Router.route("/showTeachers").get(showTeachers)
Router.route("/inquary/teacher").post(UserAuthCheck , applyForTeacherInquary)
Router.route("/search/teacher").get(searchTeacher)
Router.route("/applyed/teacher").post(UserAuthCheck , studentAppliedTeachers)


export default Router