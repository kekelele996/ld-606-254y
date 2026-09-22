import { Router } from "express";
import { yardSlotController } from "../controllers/YardSlotController";

const router = Router();

// 箱位占用只能由靠泊计划审批联动产生，不开放直接创建。
router.get("/", yardSlotController.list);

export default router;
