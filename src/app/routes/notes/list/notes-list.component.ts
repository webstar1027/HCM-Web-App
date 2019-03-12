import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { NoteService } from "../../../core/services/components/notes-service";
import { NoteModel } from "../../../core/models/notes/note-model";

@Component({
  selector: "app-notes-component",
  templateUrl: "./notes-list.component.html"
})
export class NotesListComponent implements OnInit {
  isLoadingData = false;
  notesList: NoteModel[];
  linkType = "referral";

  loadNotes(): any {
    this.isLoadingData = true;
    this.noteService.getNotesForLinkId(3, this.linkType).subscribe(e => {
      this.notesList = e;

      this.isLoadingData = false;
    });
  }

  loadNoteDetails(noteId: number): void {
    const link = ["./", noteId];
    this.router.navigate(link);
  }

  constructor(
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log(this.route.data)
    // console.log(this.route.paramMap);
    // console.log(this.route.url);
    this.route.data.subscribe(data => {
      this.notesList = data["notes"];
      console.log(this.notesList);
    });
  }
}
