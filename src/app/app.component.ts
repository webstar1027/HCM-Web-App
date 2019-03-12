import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Configuration } from "./core/configuration";
import { ToasterConfig } from "angular2-toaster";
import { AuthService } from "./core/authorization/auth.service";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(
    config: Configuration,
    private authService: AuthService,
    private router: Router
  ) {
    config.ApiBaseUrl = environment.apiUrl;
  }

  public toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: "toast-bottom-right",
    showCloseButton: false
  });

  ngOnInit() {
    if (window.location.href.indexOf("?postLogout=true") > 0) {
      this.authService.signoutRedirectCallback().then(() => {
        const url: string = this.router.url.substring(
          0,
          this.router.url.indexOf("?")
        );
        this.router.navigateByUrl(url);
      });
    }
    $(document).on("click", '[href="#"]', e => e.preventDefault());
  }
}
