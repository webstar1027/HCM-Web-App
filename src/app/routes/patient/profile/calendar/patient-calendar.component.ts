import { Component, Input, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarService, LookupService, PatientService, EmployeeService } from '@app/core/services';
import { EmployeeListModel } from '@app/core/models';
import { ChartContract,ChartAuthorization } from '@app/core/models/interfaces/chart/IChartAuthorization';

@Component({
	moduleId: module.id,
	selector: 'app-patient-calendar',
	templateUrl: 'patient-calendar.component.html',
	styleUrls: ['patient-calendar.component.scss']
})


export class PatientCalendarComponent {
	patientDemographics: any;
	scheduleTypes: any;
	employeeTypes:any;
	serviceCodes:any;
	employees: EmployeeListModel[];
	contractList: ChartContract[];
	authorizationList: ChartAuthorization[] =[];

	constructor(
		private employeeService: EmployeeService,
		private patientService: PatientService,
		private calendarService: CalendarService,
		private route: ActivatedRoute
		) {

	}

	ngOnInit(): void {
		this.route.parent.data.subscribe((res) => {
			this.patientDemographics = res.patient;
		});
		this.employeeService.getEmployeeList().subscribe((res) => {
			this.employees = res
		});
		this.patientService.getChartContracts(this.patientDemographics.chartId).subscribe(res => {
				this.contractList = res.filter(contract => contract["status"] === "Active");
				console.log(this.contractList)
		});

		this.patientService.getChartAuthorizations(this.patientDemographics.chartId).subscribe((res) => {
			res.forEach(auth => {
				if(auth.chartContractId) this.authorizationList.push(auth);
			});
		});


		this.calendarService.getLookup('ScheduleViewModelStatusEnum').subscribe(scheduleTypes => {
				this.scheduleTypes = scheduleTypes;
		});


		this.calendarService.getLookup('ServiceCodeLookupService').subscribe(serviceCodes => {
				this.serviceCodes = serviceCodes;
				console.log(this.serviceCodes)
		});

	}


}
