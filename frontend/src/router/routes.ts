import type { Routes } from "@angular/router";
import { DashboardPage } from "../pages/DashboardPage";
import { VesselsPage } from "../pages/VesselsPage";
import { BerthsPage } from "../pages/BerthsPage";
import { YardPage } from "../pages/YardPage";
import { TasksPage } from "../pages/TasksPage";

/** 侧边导航与 Angular 路由共用的路由表。 */
export const routes = [
  { name: "港口运行总览", route: "/dashboard" },
  { name: "船舶预报", route: "/vessels" },
  { name: "泊位计划", route: "/berths" },
  { name: "堆场箱位", route: "/yard" },
  { name: "作业派工", route: "/tasks" }
] as const;

export const appRoutes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardPage },
  { path: "vessels", component: VesselsPage },
  { path: "berths", component: BerthsPage },
  { path: "yard", component: YardPage },
  { path: "tasks", component: TasksPage },
  { path: "**", redirectTo: "dashboard" }
];
