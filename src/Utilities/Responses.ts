import { NextFunction } from 'express'
import {Request , Response} from '../Exports'
export class ApiResponse {
    private statusCode:number
    private message:string
    private data?:object
    private success?:boolean
    constructor(statusCode:number , message:string , data?:object , success?:boolean){
        this.statusCode= statusCode
        this.message= message
        this.data= data
        this.success= true
    }
}
export class ApiErrorResponse  extends Error{
    statusCode:number
    message:string
    stack?: string
    errors?:[]
    success:boolean
    constructor(statusCode:number , message:string , stack?:string , errors?:[] , success?:boolean){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.success = false
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}
export const  ApiSuccessResponse = (res:Response , statusCode:number = 200 , message:string , data?:any )=>{
    return res.status(200).json(new ApiResponse(statusCode, message , data ))
}
export  function globleErrorHandler(err:ApiErrorResponse, req:Request, res:Response, next:NextFunction) {
    if(err instanceof ApiErrorResponse){
        return res.status(err.statusCode).json({
            statusCode:err.statusCode,
          message: err.message,
            success:err.success
        });
    }
    return res.status(500).json({
        statusCode:500,
        message:"Something went wrong from our side ",
        success:false
    })
}