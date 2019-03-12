import {
  AuthService} from "@app/core/authorization/auth.service";
import { UserInfoLinkedCompaniesModel } from "@app/core/authorization/UserInfoLinkedCompaniesModel";
import { SidenavService } from '../core/services/components/sidenav.service';
import { HeaderMenuComponent } from './headermenu/headermenu.component';

import { MatSidenav } from '@angular/material';

import {
  Component,
  OnInit,
  Inject,
  forwardRef,
  ViewChild,
  Renderer2,
  AfterViewInit,
  Output,
  EventEmitter
 } from "@angular/core";
declare var $: any;

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html"
})
export class LayoutComponent implements OnInit, AfterViewInit {
  menuItems: Array<any>;
  menuOpened = false;
  isAuthentication = false;
  linkedCompanies: any[];

  HomeNavMenu = {
    text: "Home",
    link: "/home",
    icon: "icon-home"
  };

  ManagementNavmen = {
    text: "Management",
    link: "/management/users",
    icon: "icon-speedometer"
  };

  ReferralNavmen = {
    text: "Referral",
    link: "/referral/list",
    icon: "fa fa-table"
  };

  PatientNavMenu = {
    text: "Patient",
    link: "patient/list",
    icon: "fa fa-hospital-o"
  };

  HumanResourcesNavmenu = {
    text: "Human Resources",
    link: "/human-resources/employees",
    icon: "fa fa-users"
  };

  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild(HeaderMenuComponent) headerMenuComponent: HeaderMenuComponent;
  @Output() clickOutside = new EventEmitter();

  constructor(
    public authService: AuthService,
    private sidenavservice: SidenavService,
    private renderer: Renderer2
  ) {
    this.menuItems = new Array();
    this.menuItems.push(this.HomeNavMenu);
    this.menuItems.push(this.ReferralNavmen);
    this.menuItems.push(this.PatientNavMenu);
    this.menuItems.push(this.ManagementNavmen);
    this.menuItems.push(this.HumanResourcesNavmenu);

    window.addEventListener('resize', () => {

      if (window.innerWidth <= 768) {
        this.sidenav.close();
        this.onMobileChange(false);

      } else {
        this.sidenav.open();
        this.onDeskTopChange();
      }

    });
  }

  ngOnInit() {
      if (localStorage.getItem('currentUser')) {
        this.isAuthentication = true;
      }

      this.getLinkedCompanies();
  }

  ngAfterViewInit() {
      this.sidenavservice.setSidenav(this.sidenav);

      if (window.innerWidth <= 768) {
        this.sidenav.close();
      }
  }

  onToggleMenu(event) {
      this.menuOpened = event.opened;
      const sidecontent = document.getElementById('side_content');
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
          this.onMobileChange(event.opened);
      } else {
          if (event.opened === true) {
            this.renderer.setStyle(sidecontent, 'margin-left', '380px');
          } else {
            this.renderer.setStyle(sidecontent, 'margin-left', '220px');
          }
      }
  }

  onMobileChange(flag: boolean): void {
    const sidecontent = document.getElementById('side_content');
    this.renderer.setStyle(sidecontent, 'margin-left', '0px');

    if (flag === true) {
        this.sidenav.toggle();
    } else {
        this.sidenav.close();
    }
  }

  onDeskTopChange(): void {
    const sidecontent = document.getElementById('side_content');
    this.renderer.setStyle(sidecontent, 'margin-left', '220px');
  }

  outerClick(event: any): void {
     const target = event.target;
     const idAttr = target.attributes.id;

     if (window.innerWidth < 768) {
        if ( this.menuOpened === true) {
            if (idAttr) {
                const value = idAttr.nodeValue;
                if (value !== 'toggleButton') {
                  this.headerMenuComponent.toggleMobileMenu();
                }
            } else {
                this.headerMenuComponent.toggleMobileMenu();
            }
        }
     }
  }

  toggleChange(): void {
    this.headerMenuComponent.toggleMobileMenu();
  }

  logout(): void {
    this.authService.logout();
  }

  public getLinkedCompanies(): void {
    this.linkedCompanies = this.authService.getLinkedCompanies();
  }

  public getUserName(): string {
    this.getLinkedCompanies();
    return this.authService.getFullName();
  }
}
