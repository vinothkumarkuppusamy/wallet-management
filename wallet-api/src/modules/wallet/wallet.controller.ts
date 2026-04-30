import { Request, Response } from "express";
import walletService from "./wallet.service";
import { Auth } from "../../common/decorators/auth.decorator";

class walletController {
  // Add Money
  @Auth()
  async addMoney(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { amount } = req.body;

    const result = await walletService.addMoney(userId, amount);

    res.json({
      status: true,
      message: result.message,
    });
  }

  // Withdraw Money
  @Auth()
  async withdrawMoney(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { amount } = req.body;

    const result = await walletService.withdrawMoney(userId, amount);

    res.json({
      status: true,
      message: result.message,
    });
  }

  // Passbook
  @Auth()
  async getPassbook(req: Request, res: Response) {
    const userId = (req as any).user.id;

    const result = await walletService.getPassbook(userId);

    res.json({
      status: true,
      message: "Passbook retrieved successfully",
      data: result,
    });
  }
}

export default new walletController();