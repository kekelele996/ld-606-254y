-- port-yard 本地数据库结构（MySQL 8.0）
-- 说明：当前后端演示使用内存种子（backend/src/seed.ts），本脚本给出等价的关系结构与初始数据。

CREATE TABLE IF NOT EXISTS vessel (
  id INT PRIMARY KEY,
  vessel_name VARCHAR(128) NOT NULL,
  imo_no VARCHAR(32),
  carrier VARCHAR(128),
  length_m DECIMAL(8,2) NOT NULL DEFAULT 0,
  draft_m DECIMAL(6,2) NOT NULL DEFAULT 0,
  eta DATETIME NULL,
  etd DATETIME NULL,
  status VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS berth (
  id INT PRIMARY KEY,
  berth_code VARCHAR(32) NOT NULL,
  length_m DECIMAL(8,2) NOT NULL DEFAULT 0,
  water_depth_m DECIMAL(6,2) NOT NULL DEFAULT 0,
  berth_type VARCHAR(32),
  current_status VARCHAR(32),
  safety_note VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS berth_plan (
  id INT PRIMARY KEY,
  vessel_id INT NOT NULL,
  berth_id INT NOT NULL,
  planned_arrival DATETIME NOT NULL,
  planned_departure DATETIME NOT NULL,
  priority VARCHAR(16) DEFAULT 'NORMAL',
  status VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
  dispatcher_id INT,
  reserved_slot_id INT NULL,
  INDEX idx_plan_berth_time (berth_id, planned_arrival, planned_departure),
  INDEX idx_plan_status (status)
);

CREATE TABLE IF NOT EXISTS yard_slot (
  id INT PRIMARY KEY,
  yard_area VARCHAR(8) NOT NULL,
  row_no VARCHAR(8) NOT NULL,
  bay_no VARCHAR(8) NOT NULL,
  tier_no VARCHAR(8) NOT NULL,
  container_no VARCHAR(32) DEFAULT '',
  slot_status VARCHAR(16) NOT NULL DEFAULT 'EMPTY',
  cargo_type VARCHAR(16) DEFAULT 'EMPTY',
  reserved_by_plan INT NULL,
  INDEX idx_slot_status (slot_status)
);

CREATE TABLE IF NOT EXISTS work_task (
  id INT PRIMARY KEY,
  berth_plan_id INT NOT NULL,
  yard_slot_id INT NULL,
  task_type VARCHAR(16),
  team_id INT,
  status VARCHAR(16) DEFAULT 'PLANNED',
  planned_start DATETIME NULL,
  finished_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  actor VARCHAR(64),
  action VARCHAR(64),
  target_type VARCHAR(32),
  target_id VARCHAR(32),
  detail VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始数据（与 backend/src/seed.ts 对齐）
INSERT INTO vessel (id, vessel_name, imo_no, carrier, length_m, draft_m, eta, etd, status) VALUES
  (1, '远洋先锋', 'IMO-9472816', '中远海运', 220, 11.5, '2026-09-22 06:00:00', '2026-09-22 20:00:00', 'EXPECTED'),
  (2, '南海明珠', 'IMO-9288719', '招商轮船', 180, 9.2, '2026-09-23 02:00:00', '2026-09-23 16:00:00', 'EXPECTED'),
  (3, '东方海湾', 'IMO-9655271', '海丰国际', 260, 13.8, '2026-09-24 00:00:00', '2026-09-24 18:00:00', 'EXPECTED'),
  (4, '华海快航', 'IMO-9119994', '中谷物流', 150, 7.6, '2026-09-22 10:00:00', '2026-09-23 02:00:00', 'EXPECTED');

INSERT INTO berth (id, berth_code, length_m, water_depth_m, berth_type, current_status, safety_note) VALUES
  (1, 'B-01', 300, 15, 'CONTAINER', 'AVAILABLE', '主航道侧，注意强风流'),
  (2, 'B-02', 200, 10, 'CONTAINER', 'AVAILABLE', '夜间限制作业'),
  (3, 'B-03', 180, 9, 'BULK', 'AVAILABLE', '散货泊位，龙门吊检修中');

INSERT INTO berth_plan (id, vessel_id, berth_id, planned_arrival, planned_departure, priority, status, dispatcher_id, reserved_slot_id) VALUES
  (1, 1, 1, '2026-09-22 08:00:00', '2026-09-22 18:00:00', 'HIGH', 'APPROVED', 1, 11),
  (2, 2, 2, '2026-09-23 04:00:00', '2026-09-23 14:00:00', 'NORMAL', 'DRAFT', 1, NULL),
  (3, 3, 2, '2026-09-23 08:00:00', '2026-09-23 20:00:00', 'NORMAL', 'CONFLICT', 1, NULL),
  (4, 4, 3, '2026-09-22 12:00:00', '2026-09-23 00:00:00', 'LOW', 'DRAFT', 1, NULL);

INSERT INTO yard_slot (id, yard_area, row_no, bay_no, tier_no, container_no, slot_status, cargo_type, reserved_by_plan) VALUES
  (11, 'A', 'R1', 'B1', 'T1', '', 'RESERVED', 'EMPTY', 1),
  (12, 'A', 'R1', 'B1', 'T2', '', 'EMPTY', 'EMPTY', NULL),
  (13, 'A', 'R1', 'B2', 'T1', 'CBHU8821104', 'OCCUPIED', 'FULL', NULL),
  (14, 'A', 'R2', 'B1', 'T1', '', 'EMPTY', 'EMPTY', NULL),
  (15, 'A', 'R2', 'B2', 'T1', '', 'EMPTY', 'EMPTY', NULL),
  (16, 'A', 'R2', 'B3', 'T1', 'MSCU7712039', 'LOCKED', 'FULL', NULL),
  (21, 'B', 'R1', 'B1', 'T1', '', 'EMPTY', 'EMPTY', NULL),
  (22, 'B', 'R1', 'B1', 'T2', '', 'EMPTY', 'EMPTY', NULL),
  (23, 'B', 'R1', 'B2', 'T1', '', 'EMPTY', 'EMPTY', NULL),
  (24, 'B', 'R2', 'B1', 'T1', 'TCLU5520918', 'OCCUPIED', 'FULL', NULL),
  (25, 'B', 'R2', 'B2', 'T1', '', 'EMPTY', 'EMPTY', NULL),
  (26, 'B', 'R2', 'B3', 'T1', '', 'EMPTY', 'EMPTY', NULL);

INSERT INTO work_task (id, berth_plan_id, yard_slot_id, task_type, team_id, status, planned_start, finished_at) VALUES
  (1, 1, 11, 'DISCHARGE', 1, 'PLANNED', '2026-09-22 09:00:00', NULL);
