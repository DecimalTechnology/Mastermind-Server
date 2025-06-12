import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string|any;
    adminId:any
    user:any ;
    role:string;// Add your custom property here
  }
}