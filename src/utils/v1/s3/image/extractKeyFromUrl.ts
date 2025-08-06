export const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    // Example S3 URL: https://your-bucket.s3.ap-south-1.amazonaws.com/profile/user1.jpg
    const s3BasePattern = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

    if (!url.startsWith(s3BasePattern)) {
      return null; // not a valid S3 URL
    }

    return url.replace(s3BasePattern, ""); // returns profile/user1.jpg
  } catch (error) {
    console.error("Error extracting key from S3 URL:", error);
    return null;
  }
};
