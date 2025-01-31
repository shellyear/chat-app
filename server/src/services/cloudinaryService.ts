import Config from "../config";
import * as cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: Config.CLOUDINARY_CLOUD_NAME,
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET,
});

const uploadImageStream = async (
  folder: string,
  userId: string,
  profilePicture: Express.Multer.File
): Promise<string> => {
  let imgUrl = "";
  const result = await cloudinary.v2.uploader.upload_stream(
    {
      folder,
      public_id: `user-${userId}`,
    },
    (err, result) => {
      if (err) {
        throw new Error("Error uploading image to Cloudinary");
      } else {
        imgUrl = result?.secure_url as string;
      }
    }
  );
  profilePicture.stream.pipe(result); // Pipe the file buffer into Cloudinary
  return imgUrl;
};

const cloudinaryService = {
  uploadImageStream,
};

export default cloudinaryService;
