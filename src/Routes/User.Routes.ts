





import express from 'express'
import { UserAuthCheck } from '../Middleware/AuthCheck.Middleware'
import { changePasswordFromEmailLink, changeUserEmail, forgotPasswordDirectly, generateEmailVerificationTokens, generatePasswordResetTokens, getNewAccessToken, logoutUser, setNewAvatar, updateDetails, verifyEmail } from '../Controllers/User.Controller'



const Router = express.Router()

Router.route("/logout").get(UserAuthCheck , logoutUser)
Router.route("/update/details").patch(UserAuthCheck , updateDetails)
Router.route("/forgotPassword/directly").put(forgotPasswordDirectly)
Router.route("/generateEmailToken").get(UserAuthCheck , generateEmailVerificationTokens)
Router.route("/verify/email/:token/:email").get(verifyEmail)
Router.route("/change/email").patch(UserAuthCheck ,changeUserEmail )
Router.route("/generate/password/tokens").patch(generatePasswordResetTokens)
Router.route("/change/password/link/:token/:email").patch(changePasswordFromEmailLink)
Router.route("/get/NewAccessToken").get(getNewAccessToken)
Router.route('/set/avatar').patch(UserAuthCheck , setNewAvatar)

export default Router
