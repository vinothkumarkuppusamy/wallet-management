import { Router } from "express";
import walletController from "./wallet.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { addMoneySchema, passbookQuerySchema, withdrawSchema } from "./wallet.validation";

const router = Router();

router.post("/add", validate(addMoneySchema), walletController.addMoney);
router.post("/withdraw", validate(withdrawSchema), walletController.withdrawMoney);
router.get("/passbook", validate(passbookQuerySchema), walletController.getPassbook);

export default router;