// // // upload.ts
// // import multer from "multer";
// // import multerS3 from "multer-s3";
// // import s3 from '../../../../config/s3Config'
// // import dotenv from "dotenv";
// // dotenv.config();

// // const uploadImageS3 = multer({
// //   storage: multerS3({
// //     s3,
// //     bucket: process.env.AWS_BUCKET_NAME!,
    
// //     metadata: (req, file, cb) => {
// //       cb(null, { fieldName: file.fieldname });
// //     },
// //     key: (req, file, cb) => {
// //       const fileName = `images/${Date.now()}-${file.originalname}`;
// //       cb(null, fileName);
// //     },
// //   }),
// // });

// // export default uploadImageS3;

// import multer from "multer";
// import multerS3 from "multer-s3";
// import s3 from "../../../../config/s3Config";
// import dotenv from "dotenv";
// dotenv.config();

// const uploadMediaS3 = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_BUCKET_NAME!,
//     contentType: multerS3.AUTO_CONTENT_TYPE, // Important for setting correct video MIME type
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       const folder = file.fieldname === "videos" ? "videos" : "images";
//       const fileName = `${folder}/${Date.now()}-${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
//   limits: {
//     fileSize: 100 * 1024 * 1024 // 100MB max (adjust as needed for videos)
//   }
// });

// export default uploadMediaS3;

import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../../../../config/s3Config";
import dotenv from "dotenv";


console.log("🚀 AWS_BUCKET_NAME is:", process.env.AWS_BUCKET_NAME);
const uploadMediaS3 = multer({

  
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE, // Important for setting correct video MIME type
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const folder = file.fieldname === "videos" ? "videos" : "images";
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max (adjust as needed for videos)
  }
});

export default uploadMediaS3;
