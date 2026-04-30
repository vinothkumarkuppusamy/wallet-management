import { Request, Response } from "express";
import kycService from "./kyc.service";
import { STATUSCODE } from "../../common/utils/response";
import { Auth } from "../../common/decorators/auth.decorator";

class kycController {
  //   Upload KYC Document
  @Auth()
  async uploadKyc(req: Request, res: Response) {
    const userId = (req as any).user.id;

    if (!req.file) {
      res.status(STATUSCODE.BAD_REQUEST).json({ message: "File is required" });
      return;
    }

    const filePath = req.file.path;

    const result = await kycService.uploadKyc(userId, filePath);

    res.json({
      success: true,
      message: "KYC submitted successfully",
      data: result,
    });
  }

  //   Get KYC Status
  @Auth()
  async getStatus(req: Request, res: Response) {
    const userId = (req as any).user.id;

    const result = await kycService.getKycStatus(userId);

    res.json({
      success: true,
      data: result,
    });
  }
}

export default new kycController();