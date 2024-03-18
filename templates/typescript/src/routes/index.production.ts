import { Router } from "express";

const router = Router();

router.use("/v1/auth/", require("./v1/auth/index.route").default);

export default router;