import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { NoteService } from "../../../core/services/components/notes-service";
import { NoteModel } from "../../../core/models/notes/note-model";

declare var $: any;

@Component({
  templateUrl: "./note-edit.component.html"
})
export class NoteEditComponent implements OnInit {
  noteId: number;
  noteDetails: NoteModel;
  private linkId: number;
  private linkType: string;

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(p => {
      this.linkId = +p.id;
    });
    this.linkType = this.route.parent.snapshot.data.linkType;
    this.route.params.subscribe(params => {
      this.noteId = +params.noteId;
      if (isNaN(this.noteId) === false && this.noteId != null) {
        this.loadNote();
      } else {
        this.createNote();
      }
    });

    $("#summernote").summernote({
      height: 230,
      dialogsInBody: true,
      callbacks: {
        onChange: (contents, $editable) => {
          this.noteDetails.content = contents;
          // console.log(contents);
        }
      }
    });
    $(".note-popover").css({ display: "none" });
  }

  private createNote() {
    this.noteDetails = new NoteModel();
    this.noteDetails.linkId = this.linkId;
    this.noteDetails.linkType = this.linkType;
  }

  private loadNote() {
    this.noteService.getNoteById(this.noteId).subscribe(e => {
      this.noteDetails = e;
      $("#summernote").summernote("code", e.content);
    });
  }

  cancel() {
    this.location.back();
  }

  save() {
    this.noteService.saveNote(this.noteDetails).subscribe(e => {
      console.log(e.content);
      this.location.back();
    });
  }

  constructor(
    private noteService: NoteService,
    private route: ActivatedRoute,
    private location: Location
  ) {}
}
