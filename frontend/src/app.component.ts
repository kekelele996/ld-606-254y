import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { routes } from "./router/routes";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <div class="shell">
    <aside>
      <div class="brand">港口泊位与<br/>堆场协同系统</div>
      <nav>
        <a *ngFor="let route of routes" [routerLink]="route.route" routerLinkActive="active">{{ route.name }}</a>
      </nav>
    </aside>
    <main class="page-host">
      <router-outlet />
    </main>
  </div>`
})
export class AppComponent {
  routes = routes;
}
