import { Router } from "express";
import userController from "./user.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { registerSchema } from "./user.validation";

const router = Router();

router.post("/register", validate(registerSchema), userController.registerUser);

export default router;