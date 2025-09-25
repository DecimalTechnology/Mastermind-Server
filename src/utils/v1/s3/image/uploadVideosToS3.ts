import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3 from "../../../../config/s3Config";

const bucketName = process.env.AWS_BUCKET_NAME!;

/**
 * Uploads videos to S3 under the `videos/` folder.
 * @param files - array of files from multer.memoryStorage()
 * @returns string[] of uploaded S3 URLs
 */
export const uploadVideosToS3 = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileKey = `videos/${randomUUID()}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  });

  return Promise.all(uploadPromises);
};
