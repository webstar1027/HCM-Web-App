import { SidenavService } from '../../core/services/components/sidenav.service';
import { HeaderMenuComponent } from '../headermenu/headermenu.component';
import { Component, OnInit, Injector, HostBinding,  Input,  OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {

  expanded: boolean;

  @Input() item: any;
  @Input() depth: number;

  constructor(public injector: Injector, private sidenavservice: SidenavService) {
  }

  ngOnInit() {
      if (this.depth === undefined) {
         this.depth = 0;
      }
  }

  ngOnDestroy() {

  }

  onItemSelected(item: any): void {
    if (window.innerWidth < 768) {
        setTimeout(() => {
          this.sidenavservice.callHearderMenuToggleButton(false);
        }, 1000);
    }
  }

}
