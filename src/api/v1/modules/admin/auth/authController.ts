import { NextFunction, Request, Response } from "express-serve-static-core";
import { AuthService } from "./authServices";
import { NotFoundError, UnAuthorizedError } from "../../../../../constants/customErrors";
import { loginSchema } from "../../../../../validations/admin/auth";
import { generateAccessToken, verifyRefreshToken } from "../../../../../utils/v1/token/token";
import { STATUS_CODES } from "../../../../../constants/statusCodes";
const { OK } = STATUS_CODES;

export class AuthController {
    constructor(private authService: AuthService) {}

    // @desc   Get All Users
    // @route  GET v1/admin/users
    // @access Admin
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.authService.getAllUsers();
            res?.status(OK).json({ success: true, data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Approve user registration request
    // @route  get v1/admin/user/approve
    // @access Admin
    async approveUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.authService.approveUser(req.query.userId as string);
            res?.status(OK).json({ success: true, message: "User verification successfull", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   admin login
    // @route  get v1/admin/login
    // @access Admin
    async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const credentials = loginSchema.parse(req.body);
            const response = await this.authService.adminLogin(credentials as { email: string; password: string });
            const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000;
            const REFRESH_TOKEN_MAX_AGE = 48 * 60 * 60 * 1000;
            res?.status(OK)
                .cookie("mastermind_admin_access_token", response?.accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: ACCESS_TOKEN_MAX_AGE,
                    secure: true,
                })
                .cookie("mastermind_admin_refresh_token", response?.accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: REFRESH_TOKEN_MAX_AGE,
                    secure: true,
                })
                .json({ success: true, message: "Admin verification successfull", data: response });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Refresh acess token
    // @route  get v1/admin/refresh-token
    // @access Admin
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.cookies.mastermind_admin_refresh_token;

            if (!refreshToken || !verifyRefreshToken(refreshToken)) throw new UnAuthorizedError("Session expired. Please login again");

            const payload = verifyRefreshToken(refreshToken);

            const newAccesstoken = generateAccessToken(payload?.data);
            console.log(newAccesstoken);
            const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000;
            res.status(OK)
                .cookie("mastermind_admin_access_token", newAccesstoken, {
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: ACCESS_TOKEN_MAX_AGE,
                    secure: true,
                })
                .json({ success: true, message: "", data: { newAccesstoken } });
        } catch (error) {
            next(error);
        }
    }
}
