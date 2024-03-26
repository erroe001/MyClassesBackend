

import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'



export const uploadImageinCloudinary = async(localFile:string)=>{
  try {
if(!localFile) return null
    const uplodedImage = await cloudinary.uploader.upload(localFile , {
       resource_type:"auto"
    })
    fs.unlinkSync(localFile)
    return uplodedImage
    
  } catch (error) {
    fs.unlinkSync(localFile)
    return null
  }

}


export const deleteImagefromCloudinary = async(publicId:string)=>{
  try {
    if(!publicId) return null
    await cloudinary.api.delete_resources([publicId],{
      resource_type:"image"
    })
    return true

  } catch (error) {
    return null
  }
}