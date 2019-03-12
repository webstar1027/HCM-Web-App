import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
// import swal from 'sweetalert2'
import { of } from "rxjs/observable/of";

@Injectable()
export class DialogService {
  /**
   * Ask user to confirm an action. `message` explains the action and choices.
   * Returns observable resolving to `true`=confirm or `false`=cancel
   */
  confirm(message?: string): Observable<boolean> | Promise<boolean> {
    const confirmation = Observable.fromPromise(
      sweetAlert({
        title: "Leave this page?",
        text: message,
        icon: "warning",
        buttons: {
          cancel: {
            visible: true,
            text: "Cancel",
            className: "btn btn-primary"
          },
          confirm: {
            visible: true,
            text: "Confirm",
            className: "btn btn-secondary"
          }
        }
      })
    );
    console.log("Diolog called");

    return confirmation;
  }
}
