
import jwt from 'jsonwebtoken'


import mongoose from 'mongoose';
export const generateAccessToken = (payload:any) => {
  
    const token = jwt.sign({ data: payload }, `${process.env.JWT_SECRET}`, { expiresIn:`30d`});
    return token;
};
 


export const generateRefreshToken = (payload:any) => {
    const token = jwt.sign({ data: payload }, `${process.env.JWT_SECRET}`, { expiresIn: `48h` });
    return token;
};



export const verifyToken = (token: string):any => {
    try {
         const secret = `${process.env.JWT_SECRET}`;
         const decoded = jwt.verify(token, secret);
         return decoded;
    } catch (error: any) {
         
         console.log("Error while jwt token verification");
         
         return null
    }
};



export const verifyRefreshToken = (token: string):any => {
    try {
         const secret = `${process.env.JWT_SECRET}`;
         const decoded = jwt.verify(token, secret);
         return decoded;
    } catch (error) {
         return null;
         console.log(error as Error);
    }
};