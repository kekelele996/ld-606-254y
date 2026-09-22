import { mockData } from "../mocks/seedData";
import { request } from "./http";
import type { WorkTask } from "../types/WorkTask";

const endpoint = "/api/work-task";

export async function listWorkTask(): Promise<WorkTask[]> {
  try {
    return await request<WorkTask[]>(endpoint);
  } catch (error) {
    console.warn("listWorkTask fallback to mock", error);
    return [...(mockData.workTask as unknown as WorkTask[])];
  }
}
