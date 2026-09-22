CREATE TABLE IF NOT EXISTS vessel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vessel_name VARCHAR(128),
  imo_no VARCHAR(32),
  carrier VARCHAR(128),
  length_m VARCHAR(16),
  draft_m VARCHAR(16),
  eta VARCHAR(32),
  etd VARCHAR(32),
  status VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS berth (
  id INT PRIMARY KEY AUTO_INCREMENT,
  berth_code VARCHAR(32),
  length_m VARCHAR(16),
  water_depth_m VARCHAR(16),
  berth_type VARCHAR(32),
  current_status VARCHAR(32),
  safety_note VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS berth_plan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vessel_id INT,
  berth_id INT,
  planned_arrival VARCHAR(32),
  planned_departure VARCHAR(32),
  priority VARCHAR(16),
  status VARCHAR(32),
  dispatcher_id INT,
  conflict_reason TEXT,
  conflict_plan_ids VARCHAR(255),
  yard_slot_id INT,
  approved_at VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS yard_slot (
  id INT PRIMARY KEY AUTO_INCREMENT,
  yard_area VARCHAR(32),
  row_no VARCHAR(8),
  bay_no VARCHAR(8),
  tier_no VARCHAR(8),
  container_no VARCHAR(32),
  slot_status VARCHAR(16),
  cargo_type VARCHAR(32),
  reserved_by_plan_id INT
);

CREATE TABLE IF NOT EXISTS work_task (
  id INT PRIMARY KEY AUTO_INCREMENT,
  berth_plan_id INT,
  yard_slot_id INT,
  task_type VARCHAR(32),
  team_id INT,
  status VARCHAR(32),
  planned_start VARCHAR(32),
  finished_at VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  actor VARCHAR(64),
  action VARCHAR(64),
  target_type VARCHAR(32),
  target_id VARCHAR(32),
  created_at VARCHAR(32)
);
