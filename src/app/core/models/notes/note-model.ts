export class NoteModel {

    public noteId: number;
    public content: string;
    public subject: string;
    public dateCreated: Date;
    public dateModified: Date;
    public userCreated: string;
    public userModified: string;
    public linkId: number;
    public linkType: string;

    constructor() {
        this.dateCreated = new Date();
        this.dateModified = new Date();
    }

}
