import { Component, OnInit } from '@angular/core';
import { ChartContract, ChartAuthorization } from '@app/core/models/interfaces/chart/IChartAuthorization';
import { PatientService } from '@app/core/services';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { IChart } from '@app/core/models/interfaces/chart/IChart';
import { PatientContractsEditComponent } from './patient-contracts-edit/patient-contracts-edit.component';
import { AuthorizationEditComponent } from './authorization-edit/authorization-edit.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-contracts',
  templateUrl: './patient-contracts.component.html'
})
export class PatientContractsComponent implements OnInit {
  patientDemographics: IChart;
  contractList: ChartContract[] = [];
  authorizationList: ChartAuthorization[] =[];
  frequencySentence: string;
  loadingAuthList: boolean = true;
  loadingContractList: boolean = true;

  constructor(
    private patientService: PatientService,
    private modalService: BsModalService,
    public dialog: MatDialog,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe((res) => {
      this.patientDemographics = res.patient;
    })
    //getPatientContracts
    this.patientService.getChartContracts(this.patientDemographics.chartId)
      .subscribe(res=>{
        this.contractList = res;
        this.loadingContractList = false
      });

    //getPatientAuths
    this.patientService.getChartAuthorizations(this.patientDemographics.chartId)
      .subscribe(
        res=>{
          res.forEach(auth => {
            if(auth.chartContractId) this.authorizationList.push(auth);
          });
          this.loadingAuthList = false
        }
      )
  }

  openContractModal(contract?: ChartContract){
    let contractDialogRef = this.dialog.open(PatientContractsEditComponent, {
      data: {
        contract: contract,
        chartId : this.patientDemographics.chartId
      }
    });
    contractDialogRef.afterClosed().subscribe(
      result =>{
        if(result == undefined || !result.isSuccess) return;
        const indexOfContract = this.contractList.findIndex(
          e=> e.chartContractId == result.data.chartContractId
        )
        if(indexOfContract>=0)this.contractList[indexOfContract] = result.data;
        else this.contractList.push(result.data);
  })
  }

  openAuthModal(auth?:ChartAuthorization){
    const clonedAuth = !auth ? null :JSON.parse(JSON.stringify(auth)) as ChartAuthorization;
    const authDialogRef = this.dialog.open(AuthorizationEditComponent, {
      data: {
        auth: clonedAuth,
        chartId : this.patientDemographics.chartId,
        contracts: this.contractList
      }
    });
    authDialogRef.afterClosed()
          .subscribe(result => {
            console.log(result)
            if(result == undefined || !result.isSuccess) return;
            const indexOfAuth = this.authorizationList.findIndex(
              e => e.chartAuthorizationId === result.data.chartAuthorizationId
            )
            if(indexOfAuth>=0)this.authorizationList[indexOfAuth] = result.data;
            else this.authorizationList.push(result.data)
          })

  }
}
