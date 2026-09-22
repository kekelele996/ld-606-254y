import { Router } from "express";
import { berthPlanController } from "../controllers/BerthPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", berthPlanController.list);
router.post("/", rbacMiddleware(["admin", "dispatcher"]), berthPlanController.create);
router.post("/submit", rbacMiddleware(["admin", "dispatcher"]), berthPlanController.submit);
router.get("/:id/conflicts", berthPlanController.conflicts);
router.post("/:id/approve", rbacMiddleware(["admin", "dispatcher"]), berthPlanController.approve);

export default router;
