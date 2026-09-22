import { mockData } from "../mocks/seedData";
import { request } from "./http";
import type { Berth } from "../types/Berth";

const endpoint = "/api/berth";

export async function listBerth(): Promise<Berth[]> {
  try {
    return await request<Berth[]>(endpoint);
  } catch (error) {
    console.warn("listBerth fallback to mock", error);
    return [...(mockData.berth as unknown as Berth[])];
  }
}
