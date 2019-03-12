import { SidenavService } from '../../core/services';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  HostListener
} from "@angular/core";
import {
  AuthService} from "@app/core/authorization/auth.service";
import { UserInfoLinkedCompaniesModel } from "@app/core/authorization/UserInfoLinkedCompaniesModel";
declare var $: any;

@Component({
  selector: "app-header-menu",
  templateUrl: "./headermenu.component.html",
  styleUrls: ["./headermenu.component.scss"]
})
export class HeaderMenuComponent implements OnInit {
  settings: any;
  sidebarOpened = false;
  linkedCompanies: UserInfoLinkedCompaniesModel[];

  @Output() toggleMenu = new EventEmitter();

  constructor(public authService: AuthService, private sidenavservice: SidenavService) {
    this.sidenavservice.invokeEvent.subscribe(value => {
       if ( value === false) {
          this.toggleMobileMenu();
       }
    });
  }

  ngOnInit() {
    this.getLinkedCompanies();
  }

  toggleUserBlock(event: { preventDefault: () => void }) {
    event.preventDefault();
    // this.userblockService.toggleVisibility();
  }

  toggleMobileMenu() {
    this.sidebarOpened = !this.sidebarOpened;
    console.log(this.sidebarOpened);
    this.toggleMenu.emit({ opened: this.sidebarOpened });
  }

  openNavSearch(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.setNavSearchVisible(true);
  }

  setNavSearchVisible(stat: boolean) {
    // console.log(stat);
  }

  getNavSearchVisible() {
    return true;
  }

  toggleOffsidebar() {}

  toggleCollapsedSideabar() {
    console.log("collpased clicked");
  }

  isCollapsedText() {
    return true;
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
