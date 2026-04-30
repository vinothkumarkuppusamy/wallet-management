import { Router } from "express";
import userRoutes from "../modules/users/user.router";
import authRoutes from "../modules/auth/auth.router";
import walletRoutes from "../modules/wallet/wallet.router";
import kycRoutes from "../modules/kyc/kyc.router";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/wallet", walletRoutes);
router.use("/kyc", kycRoutes);
    
export default router;