import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  ChartAuthorization,
  AuthorizationDetails
} from "@app/core/models/interfaces/chart/IChartAuthorization";
import { BsModalRef } from "ngx-bootstrap/modal";
import { PatientService } from "@app/core/services/patient/patient.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotesListComponent } from "@app/routes/notes/list/notes-list.component";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgForm
} from "@angular/forms";
import { ToasterService } from "angular2-toaster";
import { LookupService } from "@app/core/services";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { lookup } from "dns";

@Component({
  selector: "app-authorization-edit",
  templateUrl: "./authorization-edit.component.html"
})
export class AuthorizationEditComponent implements OnInit {
  @ViewChild("authDetailsForm") authDetailsForm: NgForm;
  @ViewChild("authorizationForm") authForm: NgForm;
  @ViewChild('unitTypeChips') unitTypeChips;
  @ViewChild('periodChips') periodChips;
  patientAuthorization = {} as ChartAuthorization;
  chartId: number;
  authorizationDetails = {} as AuthorizationDetails;
  authLinks = ["auth Details", "linked Visits", "Notes", "Documents"];
  day = false;
  week = false;
  month = false;
  period = false;
  hours: boolean;
  visits: boolean;
  referral:boolean = false;
  dailyOptions = false;
  maxUnits: number;
  totalUnits: number;
  totalWeekdayUnitsArr: Array<any>;
  unitMaxError = false;
  overUnitsError = false;
  totalUnitsUsed: number;
  authDetailsList: AuthorizationDetails[];
  enrollmentList = [];
  contractList = [];
  serviceCodeList= [];

  constructor(
    public dialogRef: MatDialogRef<AuthorizationEditComponent>,
    private patientService: PatientService,
    private toaster: ToasterService,
    private lookup: LookupService,
    @Inject(MAT_DIALOG_DATA) data: any
) {
    this.patientAuthorization.authorizationDetails = [];

    if(data.auth) {
      this.initializeEditAuth(data)
      
    } else{
      this.patientAuthorization.chartContractId = null;
      this.patientAuthorization.enrollmentId = null;
      this.authorizationDetails.weekdaysValue = null;
    }
    console.log(this.patientAuthorization);
    if(data.referral){
      this.referral = data.referral;
      this.enrollmentList = data.referralEnrollments;
    } 
    else this.contractList = data.contracts;
    this.chartId = data.chartId;
  }

  initializeEditAuth(data){
    if(data.referral){
      this.enrollmentList = data.referralEnrollments;
      this.patientAuthorization.enrollmentId = data.auth.enrollmentId.toString();
      } else {
        this.contractList = data.contracts;
        this.patientAuthorization.chartContractId = data.auth.chartContractId.toString();
      }
    this.patientAuthorization.chartAuthorizationId = data.auth.chartAuthorizationId;
    this.patientAuthorization.authorizationNumber = data.auth.authorizationNumber;
    this.patientAuthorization.verbalAuthorization = data.auth.verbalAuthorization;
    data.auth.authorizationDetails.forEach(authDets => {
      authDets.authorizationDate = new Date(authDets.authorizationDate);
      authDets.startDate = new Date(authDets.startDate);
      authDets.endDate = new Date(authDets.endDate);
      authDets.weekdaysValue = authDets.weekdaysValue.toString();
      authDets.insuranceServiceCodeId = authDets.insuranceServiceCodeId.toString();
      delete authDets.insuranceServiceCode;
      delete authDets.dateCreated;
      delete authDets.dateModified;
      delete authDets.userCreated;
      delete authDets.userModified;
      this.patientAuthorization.authorizationDetails.push(authDets);
    });
  }

  contractCompare(id1:any, id2:any){
    return id1 == id2;
  }

  //  Change Chip selected state for Period Chips
  changeState(state: string) {
    this.day = false;
    this.week = false;
    this.month = false;
    this.period = false;
    this[state] = true;
    console.log(state, " ", this[state]);
  }

  //  Toggle whether to Display Day Options
  periodChange(e) {
    if (e.selected) {
      this.authorizationDetails.period = e.source.value;
      this.dailyOptions = false;
      if (e.source.value === "D" || (e.source.value === "W" && this.authorizationDetails.unitType == 'H') ) {
        this.dailyOptions = true;
      }
    }
  }

  unitTypeChange(e) {
    if (e.selected) {
      this.authorizationDetails.unitType = e.source.value;
      if(this.authorizationDetails.period == 'W' && this.authorizationDetails.unitType == 'V' ) {
        this.dailyOptions = false ;
        this.authorizationDetails.weekdaysValue = 0;
        this.authorizationDetails.weekdaysUOM = '';
      }
      else this.dailyOptions = true;
    }
  }

  specificDaysCheck(vent) {
    let day = parseInt(vent.source.value);
    if (vent.checked) {
      this.authorizationDetails.weekdaysValue += day;
    } else {
      this.authorizationDetails.weekdaysValue -= day;
    }
  }

  dayOptionsChange(e) {
    if (e.value == "D") {
      this.authorizationDetails.weekdaysValue = 0;
    }
  }

  updateTotalUnits(e) {
    if (e > this.maxUnits) {
      this.unitMaxError = true;
    } else {
      this.totalUnits = e;
      this.unitMaxError = false;
    }
  }

  updateMax(event) {
    event.target.max = this.maxUnits - this.totalUnitsUsed;
  }

  updateTotalUnitsLeft(e) {
    this.totalWeekdayUnitsArr = [
      this.authorizationDetails.sunUnits,
      this.authorizationDetails.monUnits,
      this.authorizationDetails.tueUnits,
      this.authorizationDetails.wedUnits,
      this.authorizationDetails.thuUnits,
      this.authorizationDetails.friUnits,
      this.authorizationDetails.satUnits
    ];
    this.totalUnitsUsed = this.totalWeekdayUnitsArr.reduce(
      (a, b, i): number => {
        if (a == undefined && b == undefined) return 0;
        else if (a == undefined) return b;
        else if (b == undefined) return a;
        return a + b;
      }
    );
    this.overUnitsError = false;
    if (this.authorizationDetails.units < this.totalUnitsUsed)
      this.overUnitsError = true;
  }
  maxUnitsChange(e) {
    this.maxUnits = e;
  }

  saveAuthDetails() {
    // return  console.log(this.periodChips)
    if (this.authDetailsForm.invalid) {
      this.toaster.pop("error", "Authorization Details Form is invalid");
    } else if (this.authorizationDetails.unitType == null) {
      this.toaster.pop("error", "Please select a Unit Type (Hours/Visits)");
    } else if (this.authorizationDetails.period == null) {
      this.toaster.pop("error", "Please select a Time Frame (Day/Week etc)");
    } else {
      this.patientAuthorization.authorizationDetails.push(this.authorizationDetails);
      this.authorizationDetails = {} as AuthorizationDetails;
      this.authorizationDetails.weekdaysValue = 0;
      // console.log(this.unitTypeChips)
      // console.log(this.periodChips);
      // return;
      this.unitTypeChips.chips._results.forEach(chip => {
        chip._selected = false;
      });
      this.periodChips.chips._results.forEach(chip => {
        chip._selected = false;
      });
      this.dailyOptions = false;
      this.authDetailsForm.resetForm();
    }
  }

  editAuthDetail(authDetail, i){
    this.authorizationDetails = authDetail;
    if(this.authorizationDetails.unitType == 'H') this.unitTypeChips.chips.first._selected = true;
    else this.unitTypeChips.chips.last._selected = true;
    if(this.authorizationDetails.period == 'D' || (this.authorizationDetails.period == 'W' && this.authorizationDetails.unitType == 'H')) this.dailyOptions = true;
    switch (this.authorizationDetails.period) {
      case 'D':
        this.periodChips.chips._results[0]._selected = true;
        break;
      case 'W':
        this.periodChips.chips._results[1]._selected = true;
        break;
      case 'M':
        this.periodChips.chips._results[2]._selected = true;
        break;
      case 'P':
        this.periodChips.chips._results[3]._selected = true;
        break;
      default:
        break;
    }
    this.patientAuthorization.authorizationDetails.splice(i, 1)
  }

  save() {
    if (this.authForm.invalid)
      this.toaster.pop("error", "Authorization Form is invalid");
    else if (this.patientAuthorization.authorizationDetails.length == 0 && this.authDetailsForm.invalid) 
      this.toaster.pop("error", "Please add one Authorization Detail(Frequency)");
    else{
      if(this.authDetailsForm.touched && this.authDetailsForm.valid && this.authorizationDetails.unitType != null && this.authorizationDetails.period != null){
        this.patientAuthorization.authorizationDetails.push(this.authorizationDetails);
      }
      if(!this.patientAuthorization.chartAuthorizationId) this.patientAuthorization.chartAuthorizationId = 0;
      this.patientService.postChartAuthorizations(this.chartId, this.patientAuthorization)
        .subscribe(
          res=>{
            this.dialogRef.close(res);
            this.toaster.pop("success", "Authorization Saved!");
          },
          e=> this.toaster.pop('error', e.error.message)
        )
    } 
  }
  ngOnInit() {

    this.lookup.getEnumNameValueLookup(LookupTypesEnum.InsuranceServiceCodesLookupService,'1','0')
      .subscribe(res=>this.serviceCodeList = res);

  }
}
