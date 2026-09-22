import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/** 作业队伍标签（派工页/时间线共用）。 */
@Component({
  selector: "app-team-tag",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="team-tag">队伍 {{ teamId }}</span>`,
  styles: [
    `
      .team-tag {
        display: inline-flex;
        align-items: center;
        border-radius: 6px;
        background: #efe8d8;
        color: #7d4d18;
        font-size: 12px;
        font-weight: 700;
        padding: 2px 8px;
      }
    `
  ]
})
export class TeamTag {
  @Input() teamId = 0;
}
