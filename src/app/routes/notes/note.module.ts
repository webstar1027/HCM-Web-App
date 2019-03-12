import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from "../../shared/shared.module";
import { NoteService } from "../../core/services/components/notes-service";
import { NotesListComponent } from './list/notes-list.component';
import { NoteEditComponent } from './edit/note-edit.component';

const routes: Routes = [{ path: "", pathMatch: "full", component: NotesListComponent },
    { path: "new", component: NoteEditComponent },
    { path: ":noteId", component: NoteEditComponent }

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
    providers: [NoteService],
    declarations: [NotesListComponent, NoteEditComponent]
})
export class NoteModule {

}
