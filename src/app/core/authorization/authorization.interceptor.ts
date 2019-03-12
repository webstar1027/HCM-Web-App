import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/do";
import { AuthService } from "./auth.service";
import { Configuration } from "../configuration";
import { ToasterService } from "angular2-toaster";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  private authService: AuthService;
  private appSettings: Configuration;
  private toastService: ToasterService;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthService);
    this.appSettings = this.injector.get(Configuration);
    this.toastService =
      this.toastService == null
        ? this.injector.get(ToasterService)
        : this.toastService;

    if (req.url.toString().startsWith(this.appSettings.ApiBaseUrl.toString())) {
      const accessToken: string = this.authService.getAccessToken();
      const headers = req.headers.set("Authorization", `Bearer ${accessToken}`);
      const authReq = req.clone({ headers });
      return next.handle(authReq).do(
        () => {},
        error => {
          const respError = error as HttpErrorResponse;
          if (
            (respError && respError.status === 401) ||
            respError.status === 403
          ) {
            this.toastService.pop('error', "Authorization failed");
          }
        }
      );
    } else {
      return next.handle(req);
    }
  }
}
