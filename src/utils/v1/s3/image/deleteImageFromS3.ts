import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

import s3 from "../../../../config/s3Config"

export const deleteS3Object = async (key: string): Promise<void> => {
  if (!key) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME, // "decimaltechnologiesbucket"
      Key: key, // e.g., "images/1752995306250-banner.png"
    });

    await s3.send(command);
    console.log(`✅ Deleted from S3: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to delete S3 object: ${key}`, error);
  }
};
