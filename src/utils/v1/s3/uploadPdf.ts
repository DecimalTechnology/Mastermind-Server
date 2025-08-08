// // uploadPdf.ts
// import AWS from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure AWS SDK
// const s3:any = new AWS.S3({
//   region: process.env.S3_BUCKET_REGION,
//   credentials: {
//     accessKeyId: process.env.S3_BUCKET_ACCESS_KEY||'',
//     secretAccessKey: process.env.S3_BUCKET_SECRET_KEY||'',
//   },
// });

// // Set up multer for handling file upload to S3
// export const uploadPdf = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.S3_BUCKET_BUCKET_NAME||'',
//     acl: 'public-read', // or 'private' depending on your use case
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       cb(null, `pdfs/${Date.now()}_${file.originalname}`);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF files are allowed!'));
//     }
//   },
// });


import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../../../config/s3Config";
import dotenv from "dotenv";
dotenv.config();

const uploadPdfS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE, // Sets correct MIME type
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `pdfs/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

export default uploadPdfS3;
