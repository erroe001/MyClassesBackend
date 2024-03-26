import { Request, RequestHandler, Response } from "express";
import { NextFunction } from "express-serve-static-core";

export const asyncHandler = (requestHandler:RequestHandler) => {
    return (req:Request, res:Response, next:NextFunction) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
  };