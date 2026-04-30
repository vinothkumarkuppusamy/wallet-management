import { Router } from "express";
import authController from "./auth.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  sendOtpSchema,
  verifyOtpSchema,
} from "./auth.validation";

const router = Router();

router.post("/send-otp", validate(sendOtpSchema), authController.sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.get("/logout", authController.logout);

export default router;