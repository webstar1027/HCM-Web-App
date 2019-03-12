import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserManager, User, WebStorageStateStore } from "oidc-client";
import { environment } from "environments/environment";
import { Configuration } from "../configuration";
import { UserInfoModel } from "./UserInfoModel";
import { UserInfoLinkedCompaniesModel } from "./UserInfoLinkedCompaniesModel";

@Injectable()
export class AuthService {
  private _userManager: UserManager;
  private _user: User;
  private _userSessionInfo: UserInfoModel;
  constructor(
    private httpClient: HttpClient,
    private hcmConfig: Configuration
  ) {
    const config = {
      authority: environment.openIdConnectSettings.authority, // Configure for identityServer
      client_id: "hcmwebappclient",
      scope: "openid profile hcmwebapiserver",
      redirect_uri: environment.appUrl + "assets/oidc-login-redirect.html", // Applciation url
      response_type: "id_token token",
      post_logout_redirect_uri: environment.appUrl + "?postLogout=true", // ApplicationURL
      userStore: new WebStorageStateStore({ store: window.localStorage })
    };
    this._userManager = new UserManager(config);
    this._userManager.getUser().then(user => {
      if (user && !user.expired) {
        this._user = user;
        const uri = `${hcmConfig.ApiBaseUrl}api/identity/userInfo`;
        this.httpClient.get<UserInfoModel>(uri).subscribe(
          resul => {
            this._userSessionInfo = resul;
          },
          error => {
            alert("adsfasdf");
          }
        );
      }
    });
  }

  isLoggedIn(): boolean {
    return this._user && this._user.access_token && !this._user.expired;
  }

  getAccessToken(): string {
    return this._user ? this._user.access_token : "";
  }

  login(): Promise<any> {
    localStorage.setItem('currentUser', '1');
    return this._userManager.signinRedirect();
  }

  logout(): Promise<any> {
    localStorage.removeItem('currentUser');
    return this._userManager.signoutRedirect();
  }

  signoutRedirectCallback(): Promise<any> {
    return this._userManager.signoutRedirectCallback();
  }

  getFullName(): string {
    return this._userSessionInfo
      ? this._userSessionInfo.displayName
      : "Loading";
  }

  getLinkedCompanies(): UserInfoLinkedCompaniesModel[] {
    return this._userSessionInfo ? this._userSessionInfo.companyLinks : null;
  }
}


