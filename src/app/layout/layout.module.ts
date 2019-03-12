import { NgModule } from "@angular/core";

// Custom layout
import { LayoutComponent } from "./layout.component";
import { HeaderMenuComponent } from "./headermenu/headermenu.component";
import { SidebarComponent } from "./navmenu/navmenu.component";
import { SharedModule } from "../shared/shared.module";
import { UserblockComponent } from "./navmenu/userblock/userblock.component";
import { UserblockService } from "./navmenu/userblock/userblock.service";
import { AuthService } from '../core/authorization/auth.service';
import { SidenavService } from '../core/services';
import { MatSidenavModule, MatListModule } from '@angular/material';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [SharedModule, MatSidenavModule, MatListModule, ClickOutsideModule],
  declarations: [
    LayoutComponent,
    HeaderMenuComponent,
    SidebarComponent,
    UserblockComponent
  ],
  exports: [
    LayoutComponent,
    HeaderMenuComponent,
    SidebarComponent,
    UserblockComponent
  ],
  providers: [UserblockService, AuthService, SidenavService]
})
export class LayoutModule {}
