import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { WorkTask } from "../types/WorkTask";
import { workTaskStore } from "../stores/WorkTaskStore";
import { TeamTag } from "../components/common/TeamTag";
import { formatDate } from "../utils/formatters";

/** 作业派工页：任务关联靠泊计划与堆场箱位，展示队伍派工 */
@Component({
  selector: "app-tasks-page",
  standalone: true,
  imports: [CommonModule, TeamTag],
  template: `
    <section class="page-grid">
      <div class="panel wide">
        <h2>港口作业任务（{{ tasks().length }}）</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>类型</th><th>靠泊计划</th><th>箱位</th><th>作业队伍</th><th>状态</th><th>计划开始</th></tr></thead>
            <tbody>
              <tr *ngFor="let t of tasks()">
                <td>{{ t.id }}</td>
                <td>{{ t.task_type }}</td>
                <td>#{{ t.berth_plan_id }}</td>
                <td>#{{ t.yard_slot_id }}</td>
                <td><app-team-tag [teamId]="t.team_id"></app-team-tag></td>
                <td><span class="badge">{{ taskStatus(t.status) }}</span></td>
                <td>{{ formatDate(t.planned_start) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class TasksPage implements OnInit {
  tasks = signal<WorkTask[]>([]);
  formatDate = formatDate;

  async ngOnInit(): Promise<void> {
    this.tasks.set(await workTaskStore.load());
  }

  taskStatus(status: string): string {
    return { PENDING: "待作业", IN_PROGRESS: "作业中", DONE: "已完成", CANCELLED: "已取消" }[status] ?? status;
  }
}
