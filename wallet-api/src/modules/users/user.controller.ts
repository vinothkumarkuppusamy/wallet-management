import { Request, Response } from "express";
import userService from "./user.service";

class userController { 
async registerUser(req: Request, res: Response) {
  const user = await userService.register(req.body);

  res.json({
    status: true,
    message: "User updated successfully",
    data: user,
  });
};
}
export default new userController();