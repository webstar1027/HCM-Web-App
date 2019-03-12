import { Component, OnInit } from "@angular/core";

import { UserblockService } from "./userblock.service";


@Component({
  selector: "app-userblock",
  templateUrl: "./userblock.component.html"
})
export class UserblockComponent implements OnInit {
  user: any;
  constructor(public userblockService: UserblockService) {
    this.user = {
      picture: "assets/img/user/01.jpg"
    };
  }

  ngOnInit() {


  }

  login() {
    this.userblockService.login();
  }
  logout() {
    this.userblockService.logout();
  }
  userBlockIsVisible() {
    return this.userblockService.isLoggedIn();
    //return this.userblockService.getVisibility();
  }
}
