



import express from  'express'
import { RegisterAdmin, VerifyTeacher, blockUser } from '../Controllers/Admin.Controller'
import { UserAuthCheck } from '../Middleware/AuthCheck.Middleware'





const Router = express.Router()






Router.route("/register").post(RegisterAdmin)
Router.use(UserAuthCheck)
// Router.use() --> 
Router.route("/unverifyed/Teacher").patch(VerifyTeacher)
Router.route("/blockUser").patch(blockUser)
// Router.route("")

export default Router