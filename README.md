# 港口泊位与堆场协同系统

面向中小港口的船舶靠泊计划、泊位资源、堆场箱位和作业任务协同平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20106>

后端健康检查：<http://localhost:21106/health>

### 靠泊计划审批与箱位联动（核心业务流）

- 提交计划 `POST /api/berth-plan`：与**同一泊位已批准（APPROVED）**计划的在港时间窗重叠时，记录照常保留并标记为 `CONFLICT`，响应 `{ plan, has_conflict, conflicts[] }` 返回全部冲突计划及原因。
- 冲突原因 `GET /api/berth-plan/:id/conflicts`：泊位页对每个 `CONFLICT` 计划展示。
- 审批计划 `POST /api/berth-plan/:id/approve`，请求体必须指定空箱位 `{ "yard_slot_id": 21 }`。以下任一不满足则**整次拒绝**（计划与箱位都不变化）：
  - 船舶总长超过泊位长度（`BERTH_LENGTH_EXCEEDED`）或吃水超过泊位水深（`BERTH_DRAFT_EXCEEDED`）；
  - 箱位已不是 `EMPTY`（`SLOT_NOT_EMPTY`）；
  - 计划已被处理（`PLAN_ALREADY_PROCESSED`，仅 `DRAFT/CONFLICT` 可审批）；
  - 未指定箱位（`SLOT_REQUIRED`）。
- 审批通过后计划置 `APPROVED` 与箱位置 `RESERVED` 在同一把锁内同时生效；重复或并发审批只有一个请求成功。
- 写操作受 RBAC 控制（请求头 `x-role: dispatcher|admin` 可审批，其余角色返回 `RBAC_DENIED`），并写入审计日志（`BerthPlan.approve`、`YardSlot.reserve`）。
- 泊位页（`/berths`）可提交、查看冲突原因并审批；堆场页（`/yard`）展示箱位占用结果与占用来源计划。

```bash
curl -X POST http://localhost:21106/api/berth-plan/2/approve \
  -H 'Content-Type: application/json' -H 'x-role: dispatcher' \
  -d '{"yard_slot_id":21}'
```


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


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

- BerthPlanStatus: constants/BerthPlanStatus、types/BerthPlanStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- YardSlotStatus: constants/YardSlotStatus、types/YardSlotStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- WorkTaskType: constants/WorkTaskType、types/WorkTaskType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。

### “审批 + 箱位联动”改动触达面

修改审批/冲突规则至少需要同步：后端 `models/BerthPlan`（reserved_slot_id）、`seed.ts`、`repositories/*`、`services/BerthPlanService`、`controllers/BerthPlanController`、`routes/BerthPlanRoutes`、`middlewares/rbacMiddleware`、`constants/errorCodes|errorMessages|logTemplates`、`constructors/BerthPlanDtoFactory`、`utils/conflict|ServiceError`；前端 `types/BerthPlan|YardSlot`、`api/BerthPlan|http`、`stores/BerthPlanStore|YardSlotStore`、`hooks/useBerthConflict|useYardMatrix`、`components/common/{ConflictBadge,StatusBadge,BerthTimeline,YardGrid}`、`pages/{BerthsPage,YardPage}`、`constants/errorMessages|BerthPlanStatus|YardSlotStatus` 与 `database/init.sql`。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
