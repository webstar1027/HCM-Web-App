import { Injectable, Inject, forwardRef } from "@angular/core";
import { AuthService } from "../authorization/auth.service";
import { Router, CanActivate } from "@angular/router";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(@Inject(forwardRef(() => AuthService)) private authService: AuthService) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.login();
    return false;
  }
}
