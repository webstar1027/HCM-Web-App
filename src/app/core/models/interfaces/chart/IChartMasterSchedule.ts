

export class ChartMasterSchedule{
  masterScheduleId: number;
  masterScheduleName: string;
  chartId: number;
  chartShiftId: number;
  masterScheduleDetails: MasterScheduleDetail[]
}

export class MasterScheduleDetail {
  masterScheduleDetailId: number;
  masterScheduleId: number;
  effectiveDate: Date;
  endDate: Date;
  chartAuthorizationDetailId: number;
  employeeId: number;
  serviceCodeId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  mutualVisit: boolean;
  isNextDay: boolean;
  visitDuration: number;
  shiftWeekdayScheduleId: number;
  chartShiftDetailId: number;
}