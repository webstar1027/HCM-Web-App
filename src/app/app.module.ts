import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToasterModule } from "angular2-toaster";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CalendarModule } from "angular-calendar";
import { DemoUtilsModule } from "./shared/components/demo-utils/module";

// Services
import { Configuration } from "./core/configuration";

// Internal components and modules
import { AppComponent } from "./app.component";
import { LayoutModule } from "./layout/layout.module";
import { SharedModule } from "./shared/shared.module";
import { RoutesModule } from "./routes/routes.module";
import { Validator } from "./core/helper/validator";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { AuthInterceptor } from "./core/authorization/authorization.interceptor";
import { AuthService } from "./core/authorization/auth.service";
import { AuthGuardService } from "./core/guards/route-authentication-guard.service";

@NgModule({
  imports: [
    HttpClientModule,
    BrowserAnimationsModule, // required for ng2-tag-input
    LayoutModule,
    SharedModule.forRoot(),
    RoutesModule,
    ToasterModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: "modal-content",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-secondary"
    }),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    CalendarModule.forRoot(),
    DemoUtilsModule
  ],
  declarations: [AppComponent],
  providers: [
    Configuration,
    Validator,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
