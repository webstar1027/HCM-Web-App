import { Component, OnInit } from "@angular/core";
import { UserInfoModel } from "@app/core/authorization/UserInfoModel";


@Component({templateUrl:"edit-profile.component.html"})
export class UserProfileEditComponent implements OnInit{

    userInfo: UserInfoModel


    public ngOnInit(){}

}