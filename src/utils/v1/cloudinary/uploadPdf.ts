import { BadRequestError } from "../../../constants/customErrors";
import cloudinary from "./cloudinary";


export const uploadPdfToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "event-reports",
      resource_type: "raw", // Required for PDFs
    });

    return result; // contains url, public_id, etc.
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Failed to upload PDF");
  }
};
