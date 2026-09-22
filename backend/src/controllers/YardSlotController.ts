import type { Request, Response } from "express";
import { yardSlotService } from "../services/YardSlotService";

export const yardSlotController = {
  list: (_req: Request, res: Response) => {
    try {
      res.json(yardSlotService.list());
    } catch (error) {
      res.status(500).json({ code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "yard slot error" });
    }
  }
};
