import { Request, Response } from "express";
import authService from "./auth.service";
import { Auth } from "../../common/decorators/auth.decorator";
import { STATUSCODE } from "../../common/utils/response";

class authController {
  async sendOtp (req: Request, res: Response) {
    const { mobile } = req.body;

  const result = await authService.sendOtp(mobile);

    res.json({
      
      status: true,
      message: result.message,
    });
  };

  async verifyOtp (req: Request, res: Response) {
    const { mobile, otp, name } = req.body;

  const result = await authService.verifyOtp(mobile, otp, name);

  res.json({
    status: true,
    message: result.message,
    data: result.data,
  });
};

@Auth()
 async logout(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(STATUSCODE.BAD_REQUEST).json({ message: "Token required" });
    return;
  }

  const result = await authService.logout(token);

  res.json({
    status: true,
    message: result.message
  });
  }
};

export  default new authController();