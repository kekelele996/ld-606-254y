import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorkTaskStore } from "../stores/WorkTaskStore";
import { TeamTag } from "../components/common/TeamTag";
import { StatusBadge } from "../components/common/StatusBadge";
import { WorkTaskTypeText } from "../constants/WorkTaskType";
import { formatDate } from "../utils/formatters";

@Component({
  selector: "app-tasks-page",
  standalone: true,
  imports: [CommonModule, TeamTag, StatusBadge],
  template: `
    <div class="page">
      <section class="page-head">
        <div>
          <p class="eyebrow">work dispatch</p>
          <h1>作业派工</h1>
        </div>
        <button class="btn" (click)="load()">刷新</button>
      </section>

      <section class="panel">
        <h2>任务列表</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>任务类型</th><th>靠泊计划</th><th>堆场箱位</th><th>作业队</th><th>状态</th><th>计划开始</th><th>完成时间</th></tr></thead>
            <tbody>
              <tr *ngFor="let task of taskStore.tasks()">
                <td>{{ task.id }}</td>
                <td>{{ typeText(task.task_type) }}</td>
                <td>#{{ task.berth_plan_id }}</td>
                <td>#{{ task.yard_slot_id }}</td>
                <td><app-team-tag [teamId]="task.team_id" /></td>
                <td><app-status-badge [value]="task.status" [label]="task.status" kind="task" /></td>
                <td>{{ task.planned_start ? formatDate(task.planned_start) : "—" }}</td>
                <td>{{ task.finished_at ? formatDate(task.finished_at) : "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class TasksPage implements OnInit {
  constructor(protected readonly taskStore: WorkTaskStore) {}

  ngOnInit() {
    this.load();
  }

  load() {
    void this.taskStore.load();
  }

  formatDate = formatDate;
  typeText = (value: string) => (WorkTaskTypeText as Record<string, string>)[value] ?? value;
}
