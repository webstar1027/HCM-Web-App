import { Component, OnInit, Inject } from "@angular/core"; 

import { Configuration } from "@app/core/configuration";
import { HttpClient } from "@angular/common/http";
import { UserInfoModel } from "@app/core/authorization/UserInfoModel";

@Component({
  templateUrl: "user-management-list.component.html"
})
export class UserManagementListComponent implements OnInit {
  public userList: UserInfoModel[];

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Configuration) private config: Configuration
  ) {}
  columnsToDisplay = ["fullName", "email", "initialPasswordSet", "editCell"];
  ngOnInit() {
    const url = this.config.ApiBaseUrl + "api/userManagement/";
    return this.http.get<any>(url).subscribe(response => {
      this.userList = response;
    });
  }
}
