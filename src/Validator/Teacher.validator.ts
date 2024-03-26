import { body } from "express-validator";






export  const RegisterTeacherValidator = ()=>{
  return [
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("completeAddress").trim().notEmpty().withMessage("Please provide your complete address"),
    body("description").trim().notEmpty().withMessage("Please provide description "),
    body("locality").trim().notEmpty().withMessage("Please provide locality"),
    body("phone")
    .notEmpty()
    .withMessage("phone required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Please provide a 10-digit mobile phone number"),
    body("qualification").trim().notEmpty().withMessage("Please provide your qualification"),
    body("subjectTeaching").trim().notEmpty().withMessage("Please provide your teaching subjects")

  ]
}


