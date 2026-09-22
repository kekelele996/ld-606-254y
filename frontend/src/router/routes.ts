import type { Routes } from "@angular/router";
import { DashboardPage } from "../pages/DashboardPage";
import { VesselsPage } from "../pages/VesselsPage";
import { BerthsPage } from "../pages/BerthsPage";
import { YardPage } from "../pages/YardPage";
import { TasksPage } from "../pages/TasksPage";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardPage },
  { path: "vessels", component: VesselsPage },
  { path: "berths", component: BerthsPage },
  { path: "yard", component: YardPage },
  { path: "tasks", component: TasksPage },
  { path: "**", redirectTo: "dashboard" }
];
