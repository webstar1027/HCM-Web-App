import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";

import { NoteModel } from "@app/core/models";
import { NoteService } from "@app/core/services";

@Injectable()
export class NotesResolver
  implements Resolve<Observable<NoteModel[]>> {
    constructor(private noteService: NoteService) {}
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<NoteModel[]> {
      const linkId = parseInt(state.url.match(/\d+/g).pop());
      console.log(linkId);
      const linkType = route.data['linkType'];
      console.log(linkType);
      const notes = this.noteService.getNotesForLinkId(linkId, linkType);
      console.log(notes);
      return notes;
    }
  }
