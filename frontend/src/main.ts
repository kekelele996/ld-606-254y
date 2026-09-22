import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withHashLocation } from "@angular/router";
import { AppComponent } from "./app.component";
import { appRoutes } from "./router/routes";
import "./styles.css";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withHashLocation())]
}).catch((error) => console.error(error));
