import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subject } from "rxjs/Subject";

@Injectable()
export class SidenavService {
  private sidenav: MatSidenav;
  invokeEvent: Subject<any> = new Subject();

  constructor() { }

  public setSidenav(sidenav: MatSidenav): void {
      this.sidenav = sidenav;
  }

  public open(): any {
      return this.sidenav.open();
  }

  public close(): any {
      return this.sidenav.close();
  }

  public toggle(): void {
      this.sidenav.toggle();
  }

  callHearderMenuToggleButton(flag: boolean):void {
     this.invokeEvent.next(flag);
  }

}
