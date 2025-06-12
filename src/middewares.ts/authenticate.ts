import { NextFunction, Request, Response } from "express";
import { verifyRefreshToken, verifyToken } from "../utils/v1/token/token";
import { UnAuthorizedError } from "../constants/customErrors";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers;

// Try to get the token from Authorization header
let token = header["authorization"] 
  ? header["authorization"].startsWith("Bearer ") 
    ? header["authorization"].split(" ")[1] 
    : null
  : null;

// If the token is not found in Authorization, check access-token header
if (!token) {
  token = header["access-token"] as string;
}

// If no token is found in either header, throw an error
if (!token) throw new UnAuthorizedError("Access token missing");

// Verify the token
const accessTokenValid = verifyToken(token);
if (!accessTokenValid) throw new UnAuthorizedError("Access token expired, login again");

// Store userId from the decoded token
req.userId = accessTokenValid.data?._id;

next();

};
