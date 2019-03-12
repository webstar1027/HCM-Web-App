import { OnInit, Directive, Input, ElementRef } from '@angular/core';
declare var $: any;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'scrollable'
})
export class ScrollableDirective implements OnInit {

  @Input() height: number;
  defaultHeight = 250;

  constructor(public element: ElementRef) { }

  ngOnInit() {
    $(this.element.nativeElement).slimScroll({
      height: (this.height || this.defaultHeight)
    });
  }

}
