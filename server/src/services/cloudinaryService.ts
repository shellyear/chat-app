import Config from "../config";
import * as cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: Config.CLOUDINARY_CLOUD_NAME,
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET,
});

const uploadImageStream = (
  folder: string,
  userId: number,
  profilePicture: Express.Multer.File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader
      .upload_stream(
        {
          folder,
          public_id: `user-${userId}`,
        },
        (err, result) => {
          if (err || !result) {
            reject(new Error("Error uploading image to Cloudinary"));
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(profilePicture.buffer);
  });
};

const cloudinaryService = {
  uploadImageStream,
};

export default cloudinaryService;
