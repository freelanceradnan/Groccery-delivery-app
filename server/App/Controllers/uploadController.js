import multer from "multer";
import cloudinary from "../Utils/cloudinary.js";

export const uploader = async (req, res) => {
   
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
   
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "grocery-del",
      resource_type: "auto",
    });

 
    return res.json({ url: result.secure_url });

  } catch (error) {
    console.error("Upload Error:", error); 
    return res.status(500).json({ message: "Something went wrong during upload" });
  }
};