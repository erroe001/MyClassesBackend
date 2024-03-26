import { body, query } from "express-validator";





export const RegisterStudentValidator = ()=>{
  return[
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email required")
      .isEmail()
      .withMessage("Please provide the email "),
    body("phoneNumber")
      .notEmpty()
      .withMessage("phone required")
      .isLength({ min: 10, max: 10 })
      .withMessage("Please provide a 10-digit mobile phone number"),
    
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please provide the full name"),
    body("currentClass").trim().notEmpty().withMessage("Please Provide Your Current Class"),
    body("reffralId").trim().notEmpty().withMessage("Please Provide the reffral Code")
  ]
}

export const StudentLoginValidator = ()=>{
  return [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("Please provide the email "),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password length should be 8-20 "),
  ]
}



export const ApplyTeacherInquaryValidator = ()=>{
  return [
    body("teacherId").trim().notEmpty().withMessage("Teacher id not emapty")
  ]
}
