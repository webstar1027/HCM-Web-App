import { NgModule, ModuleWithProviders } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { TextMaskModule } from "angular2-text-mask";

import {
  AccordionModule,
  AlertModule,
  ButtonsModule,
  CarouselModule,
  CollapseModule,
  BsDropdownModule,
  ModalModule,
  PaginationModule,
  ProgressbarModule,
  RatingModule,
  TabsModule,
  TimepickerModule,
  TooltipModule,
  TypeaheadModule,
  BsDatepickerModule,
  PopoverModule
} from "ngx-bootstrap";

import { InlineEditorModule } from "@qontu/ngx-inline-editor";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AddressManagementService, SERVICES } from "@app/core/services";

import { DIRECTIVES } from "./directives";
import { PIPES } from "./pipes";
import { COMPONENTS, EmergencyContactEditorComponent } from "./components";
import { AuthGuardService } from "@app/core/guards/route-authentication-guard.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatRadioModule } from "@angular/material/radio";
import { MatDividerModule } from "@angular/material/divider";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    PopoverModule.forRoot(),
    NgbModule.forRoot(),
    InfiniteScrollModule,
    InlineEditorModule,
    TextMaskModule,
    MatTabsModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDividerModule,
    MatRadioModule,
    MatChipsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  providers: [AddressManagementService, SERVICES, PIPES, AuthGuardService],
  declarations: [DIRECTIVES, PIPES, COMPONENTS],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AccordionModule,
    AlertModule,
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    BsDatepickerModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    ProgressbarModule,
    RatingModule,
    TabsModule,
    TimepickerModule,
    TooltipModule,
    TypeaheadModule,
    InlineEditorModule,
    InfiniteScrollModule,
    TextMaskModule,
    DIRECTIVES,
    PIPES,
    COMPONENTS,
    MatTabsModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDividerModule,
    MatRadioModule,
    MatChipsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [EmergencyContactEditorComponent]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
