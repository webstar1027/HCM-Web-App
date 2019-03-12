

import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fileExt]',
})
export class FileExtDirective implements OnInit {

    @Input() ext: any;

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {

  }

  ngOnInit() {
    const extString: string = <string>this.ext;
    const correctExt: string = extString.substring(extString.lastIndexOf('.'));
    switch (correctExt) {

      case '.pdf': {
        this.renderer.addClass(this.hostElement.nativeElement, 'fa-file-pdf-o');
        break;
      }

      case '.docx':
      case '.doc': {
        this.renderer.addClass(this.hostElement.nativeElement, 'fa-file-word-o');
        break;
      }

      case '.xlsx':
      case '.xls': {
        this.renderer.addClass(this.hostElement.nativeElement, 'fa-file-excel-o');
        break;
      }
     

      default: {
        this.renderer.addClass(this.hostElement.nativeElement, 'fa-file');
        break;
      }
    }

  }
}
