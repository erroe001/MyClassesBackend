
import { validationResult } from "express-validator";
import { ApiErrorResponse } from "../Utilities/Responses.js";
import { asyncHandler } from './../Utilities/AsyncHandler';

export const validateErrors = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors:any = [];
    errors.array().map((err:any) => extractedErrors.push({ [err.path]: err.msg }));
    throw new ApiErrorResponse(422, extractedErrors);
  } catch (error) {
    next(error)
  }
});
