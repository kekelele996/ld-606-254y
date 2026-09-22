# 港口泊位与堆场协同系统

面向中小港口的船舶靠泊计划、泊位资源、堆场箱位和作业任务协同平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20106>

后端健康检查：<http://localhost:21106/health>

### 靠泊计划审批与箱位联动（核心规则）

- 提交计划 `POST /api/berth-plan`：记录始终保留；与**同一泊位已批准（含靠泊中）计划**的在港时间重叠时标记为 `CONFLICT`、写入 `conflict_reason` 与 `conflict_plan_ids`，响应体 `{ plan, conflicts }` 返回**全部冲突计划**。
- 审批计划 `POST /api/berth-plan/:id/approve`，请求体必须指定空箱位 `{ "yard_slot_id": 3 }`。以下任一情况**整次拒绝**（HTTP 4xx），计划与箱位都不变化：
  - 船舶长度或吃水超出泊位长度/水深限制（422 `VESSEL_BERTH_MISMATCH`）；
  - 箱位已非空（`RESERVED/OCCUPIED/LOCKED`，409 `SLOT_NOT_EMPTY`）；
  - 计划已被处理（`APPROVED/BERTHING/DEPARTED/CANCELLED`，409 `PLAN_ALREADY_PROCESSED`）；
  - 未指定箱位或参数非法（400 `VALIDATION_FAILED`）。
- 审批通过后计划置为 `APPROVED` 与箱位置为 `RESERVED` 在同一临界区内完成；**重复或并发审批只能成功一次**，失败时两者都不变化（后端 `runExclusive` 串行化"再校验 + 双写"）。
- 泊位页（`/berths`）展示泊位时间轴、冲突原因徽标，并可在弹窗中点选空箱位完成审批；堆场页（`/yard`）展示箱位矩阵、预留箱位与占用率。

```bash
# 提交（重叠时返回全部冲突计划）
curl -s -X POST http://localhost:21106/api/berth-plan -H 'Content-Type: application/json' \
  -d '{"vessel_id":3,"berth_id":1,"planned_arrival":"2026-09-23T20:00:00Z","planned_departure":"2026-09-25T00:00:00Z"}'
# 审批并指定空箱位
curl -s -X POST http://localhost:21106/api/berth-plan/2/approve -H 'Content-Type: application/json' -d '{"yard_slot_id":3}'
```

后端规则冒烟测试：`cd backend && npm run test:smoke`（19 条断言）。


## 本地开发方式

- 前端：`cd frontend && npm install && npm start`（`http://localhost:20106`，`proxy.conf.json` 把 `/api` 代理到本机后端 21106）
- 后端：`cd backend && npm install && npm run dev`（默认 `http://localhost:3000`，可用 `PORT=21106`），接口统一挂在 `/api`。
- 冒烟测试：`cd backend && npm run test:smoke`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Angular 17 + TypeScript + RxJS + NG-ZORRO + ECharts |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `port-yard`
- `FRONTEND_PORT`: 前端端口，默认 `20106`
- `BACKEND_PORT`: 后端端口，默认 `21106`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: port-yard`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-port-yard}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- **BerthPlanStatus**（DRAFT/CONFLICT/APPROVED/BERTHING/DEPARTED/CANCELLED）
  - 前端：`constants/BerthPlanStatus.ts`（值/英文文案/中文 Label/色调）、`types/BerthPlanStatus.ts`（镜像再导出）、`constants/statusText.ts`、`constructors/BerthPlanConstructor.ts`、`types/BerthPlan.ts`、`components/common/StatusBadge.ts`、`components/common/ConflictBadge.ts`、`components/common/BerthTimeline.ts`、`hooks/useBerthConflict.ts`、`pages/BerthsPage.ts`、`pages/VesselsPage.ts`、`pages/DashboardPage.ts`、`mocks/seedData.ts`
  - 后端：`constants/BerthPlanStatus.ts`、`models/BerthPlan.ts`、`repositories/BerthPlanRepository.ts`（ACTIVE/PROCESSED 判定）、`services/BerthPlanService.ts`、`constructors/BerthPlanDtoFactory.ts`、`seed.ts`
- **YardSlotStatus**（EMPTY/RESERVED/OCCUPIED/LOCKED）
  - 前端：`constants/YardSlotStatus.ts`、`types/YardSlotStatus.ts`、`constants/statusText.ts`、`constructors/YardSlotConstructor.ts`、`types/YardSlot.ts`、`components/common/StatusBadge.ts`、`components/common/YardGrid.ts`、`hooks/useYardMatrix.ts`、`pages/YardPage.ts`、`pages/BerthsPage.ts`、`mocks/seedData.ts`
  - 后端：`constants/YardSlotStatus.ts`、`models/YardSlot.ts`、`repositories/YardSlotRepository.ts`（reserve 仅 EMPTY 可预留）、`services/BerthPlanService.ts`、`constructors/YardSlotDtoFactory.ts`、`seed.ts`
- **WorkTaskType**（LOAD/DISCHARGE/SHIFT/INSPECTION）：`constants/WorkTaskType.ts`、`types/WorkTaskType.ts`、`constants/statusText.ts`、`constructors/WorkTaskConstructor.ts`、`pages/TasksPage.ts`、`mocks/seedData.ts` 及后端对应 constants/models/constructors/seed。
- **错误码**：后端 `constants/errorCodes.ts` + `errors/AppError.ts` + service/controller(`wrapAsync`)；前端 `constants/errorCodes.ts`、`constants/errorMessages.ts` + `api/BerthPlan.ts` + `pages/BerthsPage.ts`。
- **日志模板**：`constants/logTemplates.ts`（前后端各一份），提交冲突 `BerthPlan.conflict`、审批 `BerthPlan.approve`、预留 `YardSlot.reserve` 在 `BerthPlanService` 落日志。

## 联动数据流

提交（`api/BerthPlan.ts → BerthPlanStore → BerthPlanService → BerthPlanRepository`）后响应 `{ plan, conflicts }`；
审批在 `BerthPlanService.approve` 的 `runExclusive` 临界区内同时更新 `berth_plan(status/yard_slot_id/approved_at)` 与 `yard_slot(slot_status/reserved_by_plan_id)`，
泊位页与堆场页重新拉取列表，`BerthTimeline/ConflictBadge` 与 `YardGrid` 分别反映冲突与预留占用结果。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
