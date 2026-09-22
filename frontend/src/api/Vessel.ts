import { mockData } from "../mocks/seedData";
import { request } from "./http";
import type { Vessel } from "../types/Vessel";

const endpoint = "/api/vessel";

export async function listVessel(): Promise<Vessel[]> {
  try {
    return await request<Vessel[]>(endpoint);
  } catch (error) {
    console.warn("listVessel fallback to mock", error);
    return [...(mockData.vessel as unknown as Vessel[])];
  }
}
