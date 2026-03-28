import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3 from "../../../../config/s3Config";

const bucketName = process.env.AWS_BUCKET_NAME!;

export const uploadImagesToS3 = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileKey = `images/${randomUUID()}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ❌ NO ACL HERE
    };

    await s3.send(new PutObjectCommand(params));

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  });

  return Promise.all(uploadPromises);
};