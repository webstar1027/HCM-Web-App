import { Injectable } from "@angular/core";
import { AuthService } from "@app/core/authorization/auth.service";

@Injectable()
export class UserblockService {
  public userBlockVisible: boolean;
  constructor(private authService: AuthService) {
    // initially visible
    this.userBlockVisible = true;
  }

  getVisibility() {
    return this.userBlockVisible;
  }

  setVisibility(stat = true) {
    this.userBlockVisible = stat;
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleVisibility() {
    this.userBlockVisible = !this.userBlockVisible;
  }
}
