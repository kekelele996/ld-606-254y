import { mockData } from "../mocks/seedData";
import { request } from "./http";
import type { YardSlotView } from "../types/YardSlot";

const endpoint = "/api/yard-slot";

export async function listYardSlot(): Promise<YardSlotView[]> {
  try {
    return await request<YardSlotView[]>(endpoint);
  } catch (error) {
    console.warn("listYardSlot fallback to mock", error);
    return [...(mockData.yardSlot as unknown as YardSlotView[])];
  }
}
