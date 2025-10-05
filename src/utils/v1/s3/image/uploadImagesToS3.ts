// utils/uploadImagesToS3.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3 from "../../../../config/s3Config";

const bucketName = process.env.AWS_BUCKET_NAME!;

export const uploadImagesToS3 = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  // files must come from multer.memoryStorage() (file.buffer)
  const uploadPromises = files.map(async (file) => {
    const fileKey = `images/${randomUUID()}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer, // the file buffer from multer memoryStorage
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    // Return only the S3 URL
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  });

  return Promise.all(uploadPromises); // This will be string[]
};
