import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { Configuration } from "../../configuration";
import { NoteModel } from "../../models/notes/note-model";

@Injectable()
export class NoteService {
  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Configuration) private config: Configuration
  ) {}

  public getNoteById(noteId: number): Observable<NoteModel> {
    const url = this.config.ApiBaseUrl + "api/notes/" + noteId;
    return this.http.get<NoteModel>(url);
  }

  public getNotesForLinkId(
    linkId: number,
    linkType: string
  ): Observable<NoteModel[]> {
    const url = this.config.ApiBaseUrl + "api/notes/getByLinkId/" + linkId;
    return this.http.get<NoteModel[]>(url, { headers: { linkType: linkType } });
  }

  public saveNote(note: NoteModel): Observable<NoteModel> {
    const url = this.config.ApiBaseUrl + "api/Notes/Save";
    console.log(note);
    return this.http.post<NoteModel>(url, note);
  }
}
