import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/** 作业队伍标签（派工页/任务卡片共用） */
@Component({
  selector: "app-team-tag",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="team">班组 {{ teamId }}</span>`,
  styles: [
    `
      .team {
        display: inline-flex;
        padding: 2px 10px;
        border-radius: 6px;
        background: #223126;
        color: #f5f1e6;
        font-size: 12px;
        font-weight: 700;
      }
    `
  ]
})
export class TeamTag {
  @Input() teamId: number | string = "-";
}
