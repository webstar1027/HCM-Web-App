import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, Pipe, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';

@Component({
  selector: 'app-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.scss']
})

export class EditableFieldComponent implements OnInit {

  private fieldValue: any;
  @ViewChild('popover') popover;

  isSaving = false;
  isEditMode = false;
  editableValue: string;
  @Output() valueChange = new EventEmitter();

  @Input() pipe: Pipe;
  @Input() pipeArgs: Array<any>;
  @Input() fieldType = 'text';
  @Input() mode = 'popup';
  @Input() saveCallback: (newValue: any) => Observable<any>;

  @Input()
  get value(): any {
    return this.fieldValue;
  }

  set value(val: any) {
    this.fieldValue = val;
  }

  get isInlineMode(): boolean {
    return this.mode === 'inline';
  }

  pipesArr: any = [];
  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    // Return Pipe object from Input() pipe string
    // if(this.pipe){
    //   PIPES.forEach( p => this.pipesArr.push(p))
    //   this.pipesArr.push( AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, I18nPluralPipe, I18nSelectPipe, JsonPipe, LowerCasePipe, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe);
    //   this.pipe = this.pipesArr.find((p)=>{
    //     return p.name == this.pipe ;
    //   })
    // }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(evt: MouseEvent): void {
    // console.log(' document click ', evt.target);

    if (this.isClickOutside(evt.target)) {
      this.cancel();
    }
  }

  enableEditMode(): void {
    if (!this.isEditMode) {
      this.editableValue = this.value;
      this.isEditMode = true;

      if (!this.isInlineMode) {
        this.popover.show();
      }
    }
  }

  save(): void {
    this.isSaving = true;
    this.value = this.editableValue;
    this.valueChange.emit(this.value);
    this.cancel();

    if (this.saveCallback) {
      this.saveCallback(this.value)
        .subscribe((res) => {
          console.log(res);
          this.isSaving = false;
        }, error => {
          console.log('Could not save data.', error);
          this.isSaving = false;
        });
    } else {
      this.isSaving = false;
    }
  }

  cancel(): void {
    if (!this.isInlineMode) {
      this.popover.hide();
    }
    this.isEditMode = false;
    this.editableValue = '';
  }

  isClickOutside(target: any): boolean {
    // console.log(' -- target --', target);

    while (target.parentNode) {
      if (target == this.element.nativeElement) {
        return false;
      }
      target = target.parentNode;
    }
    return true;
  }
}
