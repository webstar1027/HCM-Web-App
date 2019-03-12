import { ElementRef, Input, Component, OnChanges } from "@angular/core";
import { Lookup } from "../../../core/models/lookup";
import { LookupService } from "../../../core/services/components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";

@Component({
  selector: "app-convert-lookup-from-server",
  template: ""
})
export class LookupValueConverterFromServerComponent implements OnChanges {
  lookup: Lookup[];
  @Input() lookupTypeArgs: any;
  @Input() fieldValue: any;
  @Input() filterValue: any;

  constructor(
    private lookupService: LookupService,
    private element: ElementRef
  ) {}

  private renderValue(): void {
    if (!this.lookupTypeArgs || !this.fieldValue) {
      this.element.nativeElement.innerHTML = "N/A";
    } else {
      this.element.nativeElement.innerHTML =
        "<span class='fa fa-spinner fa-spin'></span>";
      const lookupTypeArgumentValue = (<any>LookupTypesEnum)[
        this.lookupTypeArgs
      ];
      this.lookupService
        .getEnumNameValueLookup(lookupTypeArgumentValue, this.filterValue)
        .subscribe(e => {
          this.lookup = e;

          const itemByValue = this.lookup.find(
            lookupItem => lookupItem.key ==  this.fieldValue
          );

          if (!itemByValue) {
            this.element.nativeElement.innerHTML = "N/A";
          } else {
            this.element.nativeElement.innerHTML = itemByValue.name;
          }
        });
    }
  }

  ngOnChanges() {
    this.renderValue();
  }
}
