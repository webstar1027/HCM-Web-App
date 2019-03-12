import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ChartContract } from '@app/core/models/interfaces/chart/IChartAuthorization';
import { LookupService, PatientService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { Lookup } from '@app/core/models';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patient-contracts-edit',
  templateUrl: './patient-contracts-edit.component.html'
})
export class PatientContractsEditComponent implements OnInit {
  insuranceList: Lookup[] = [];
  patientContract = {} as ChartContract;
  onClose: Subject<ChartContract>;
  insuranceIndex: number;
  @ViewChild('chartContractForm') form: NgForm;

  constructor(
    private lookup: LookupService,
    private toaster : ToasterService,
    private patientService: PatientService,
    private dialogRef: MatDialogRef<PatientContractsEditComponent>,
    @Inject(MAT_DIALOG_DATA)data: any
  ) {
    if(data.chartId){
      this.patientContract.chartId = data.chartId;
      this.lookup.getEnumNameValueLookup(LookupTypesEnum.InsuranceLookupService).subscribe(res=>this.insuranceList=res)

    }
    else{
      this.patientContract.chartContractId = data.contract.chartContractId;
      this.lookup.getEnumNameValueLookup(LookupTypesEnum.InsuranceLookupService).subscribe(res=>{this.insuranceList=res;this.patientContract.insuranceId = data.contract.insuranceId.toString();})
      this.insuranceIndex = data.contract.insuranceId;
      this.patientContract.chartId = data.contract.chartId;
      this.patientContract.episodeId = data.contract.episodeId;
      this.patientContract.memberId = data.contract.memberId;
      this.patientContract.effectiveDate = new Date(data.contract.effectiveDate)
      if(data.contract.endDate)this.patientContract.endDate = new Date(data.contract.endDate)
    }
    console.log(this.patientContract)
    // console.log(this.patientContract.endDate.toISOString())
    this.onClose = new Subject();
  }

  checkInsurance(e){
    this.insuranceIndex = e.value | 0;
    console.log(e)
  }

  save(){
    if(this.form.invalid) this.toaster.pop('error', 'The Contract Form is Invalid');
    else {
      if(!this.patientContract.chartContractId) this.patientContract.chartContractId = 0;
      this.patientService.postChartContract(this.patientContract)
        .subscribe(
          res=>{
            const contract = res;
            this.toaster.pop('success', 'Contract Saved!');
            this.dialogRef.close(contract)
          },
          e=>{
            this.toaster.pop('error', 'Error Saving Contract ', e.error)
          }
        )
    }
  }


  ngOnInit() {
  }

}
