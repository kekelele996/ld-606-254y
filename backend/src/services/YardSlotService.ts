import { yardSlotRepository } from "../repositories/YardSlotRepository";
import { createYardSlotViewDto, type YardSlotViewDto } from "../constructors/YardSlotDtoFactory";

export const yardSlotService = {
  /** 堆场页：展示每个箱位的占用结果（状态 + 占用计划）。 */
  list(): YardSlotViewDto[] {
    return yardSlotRepository.findAll().map(createYardSlotViewDto);
  }
};
