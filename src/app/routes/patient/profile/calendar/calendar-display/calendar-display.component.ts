import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from '@app/core/services';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { VisitDialogComponent } from '../visit-dialog/visit-dialog.component'
import { EmployeeListModel } from '@app/core/models';
import { ChartContract, ChartAuthorization } from '@app/core/models/interfaces/chart/IChartAuthorization';
import { MasterScheduleModalComponent } from '../master-schedule-modal/master-schedule-modal.component';

@Component({
	moduleId: module.id,
	selector: 'app-calendar-display',
	templateUrl: './calendar-display.component.html',
	styleUrls: ['./calendar-display.component.scss']
})
export class CalendarDisplayComponent implements OnInit {
	@Input() patientDemographics: any;
	@Input() scheduleTypes: any;
	@Input() employeeTypes: any;
	@Input() serviceCodes: any;
	@Input() employees: EmployeeListModel[];
	@Input() contractList: ChartContract[];
	@Input() authorizationList: ChartAuthorization;

	actions: CalendarEventAction[] = [];
	refresh: Subject<any> = new Subject();
	events: CalendarEvent[] = [];
	date: { year: number, month: number };
	visitType: string = 'Skilled Visit';
	view: string = 'month';
	viewDate: Date = new Date();


	constructor(
		public dialog: MatDialog,
		private calendarService: CalendarService,
		private route: ActivatedRoute
	) {

	}

	ngOnInit(): void {
		this.events = [];
		this.getSchedules();


	}

	openVisitModal(event, visitType = "Skilled", isNew = true): void {
		let dialogRef = this.dialog.open(VisitDialogComponent, {
			height: 'auto',
			width: '50%',
			data: {
				event: event,
				patientDemographics: this.patientDemographics,
				scheduleTypes: this.scheduleTypes,
				employeeTypes: this.employeeTypes,
				serviceCodes: this.serviceCodes,
				employees: this.employees,
				contractList: this.contractList,
				authorizationList: this.authorizationList,
				isNew: isNew,
				visitType: visitType
			}

		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(result);
			this.getSchedules();
			this.refresh.next();
		});

	}

	openMasterDialog(){
		const masterDialogRef = this.dialog.open(MasterScheduleModalComponent, {
			// height: '600px',
      data: {
        employees: this.employees,
        chartId : this.patientDemographics.chartId
      }
		})
		masterDialogRef.afterClosed().subscribe(
			result=>console.log(result)
		)
	}

	getEvents(schedules): void {
		this.events = [];
		for (let schedule of schedules) {
			schedule.color = this.calendarService.getStatusColor(schedule.status);
			schedule.status = this.getEventStatus(schedule);
			this.addEvent(schedule);
		}
	}

	getCurrDate(): string {
		const tmpDate = this.viewDate.toISOString();
		return tmpDate.slice(0, tmpDate.search('T'));
	}

	getEventStatus(schedule): any {
		for (let status of this.scheduleTypes) {
			if (schedule.status === eval(status.key)) {
				return status;
			}
		}


	}

	getSchedules(): void {
		let currDate = this.getCurrDate();
		this.calendarService.getPatientCalendar(this.patientDemographics.chartId, currDate).subscribe(schedules => {
			this.getEvents(schedules.data);
		});
	}
	getVisit(schedule: any): void {
		this.calendarService.getPatientVisit(schedule.chartId, schedule.chartScheduleId).subscribe(visit => {
		});
	}


	eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
		event.start = newStart;
		event.end = newEnd;
		this.handleEvent('Dropped or resized', event);
		this.refresh.next();
	}

	newEvent(visitType: string): void {
		const start: Date = new Date();
		const event = this.calendarService.getMetadata(start, this.patientDemographics);
		this.openVisitModal(event, visitType, true);
	}

	eventClicked(evnt): void {
		this.handleEvent('click', evnt);
	}

	periodClicked(): void {
		this.getSchedules();
	}

	handleEvent(action: string, event: CalendarEvent): void {
		if (event.meta.serviceCode === "PCA") {
			this.openVisitModal(event.meta, 'Unskilled', false);
		}
		else {
			this.openVisitModal(event.meta, 'Skilled', false);
		}


	}

	addEvent(schedule): void {
		this.events.push({
			title: schedule.serviceCode,
			start: new Date(schedule.startDateTime),
			end: new Date(schedule.endDateTime),
			color: schedule.color,
			draggable: true,
			resizable: {
				beforeStart: true,
				afterEnd: true
			},
			meta: schedule
		});
		this.refresh.next();

	}

}
