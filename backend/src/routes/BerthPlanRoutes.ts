import { Router } from "express";
import { berthPlanController } from "../controllers/BerthPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", berthPlanController.list);
router.post("/", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.submit);
router.get("/:id/conflicts", berthPlanController.conflicts);
router.post("/:id/approve", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.approve);

export default router;
