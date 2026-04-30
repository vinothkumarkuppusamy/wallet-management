import { Router } from "express";
import kycController  from "./kyc.controller";
import { upload } from "../../common/middlewares/upload.middleware";

const router = Router();

router.post("/upload", upload.single("document"), kycController.uploadKyc);

// Get status
router.get("/status", kycController.getStatus);
export default router;