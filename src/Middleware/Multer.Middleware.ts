import { Request } from 'express'
import multer from 'multer'
import fs from 'fs'
const storage = multer.diskStorage({

    destination: function (req:Request, file, cb) {
      cb(null, './Public')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})
export const uploadLocal = multer({ storage })


export const removeFile = async(localPath:string)=>{
    if(!localPath) return null
    try {
       await fs.unlinkSync(localPath)
        return true
    } catch (error) {
        return null
    }

}
export const removeAllFiles = async()=>{
   const files =  fs.readdirSync('./Public')
   try {
    files.map(async(path:string)=>{
    fs.unlinkSync(`./Public/${path}`)
    })
    return true
   } catch (error) {
    return null
    
   }
}