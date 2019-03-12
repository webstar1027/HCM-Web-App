import { Component, OnInit } from '@angular/core';
import { EmployeeService, ExcelExportService, CsvExportService, PdfExportService } from '@app/core/services';
import { EmployeeListModel } from '@app/core/models';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees: EmployeeListModel[] = [];
  isLoadingEmployee = false;
  loadingEmployeeId: number;
  exportDataList: object[] = [];

  constructor(
    private employeeService: EmployeeService,
    private excelExportService: ExcelExportService,
    private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService,

  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  refreshList(): void {
    this.loadEmployees();
  }

  loadEmployee(id: number): void {
    this.isLoadingEmployee = true;
    this.loadingEmployeeId = id;
  }

  private loadEmployees(): void {
    this.employeeService.getEmployeeList()
      .subscribe((data: EmployeeListModel[]) => {
        // this.employees = data;

        this.employees = [];
        data.forEach((e: EmployeeListModel) => {
          this.employees.push(new EmployeeListModel(e.employeeId, e.firstName, e.lastName, e.middleName, e.dob));

          const itemData = {
              name: e.firstName + ' ' + e.lastName,
              dob: e.dob ? e.dob : ''
          };

          this.exportDataList.push(itemData);
        });
      }, error => {
        console.log('error during loading employee list:', error);
      }, () => {

      });
  }

  exportPDF(): void {
    const columns = [
        {title: "Name", dataKey: "name"},
        {title: "Date of Birth", dataKey: "dob"}
    ];

    this.pdfExportService.saveAsPDFFile(this.exportDataList, 'employee', columns);
  }

  exportCSV(): void {
    const options = {
        headers: ["Name", "Date of Birth"]
    };

    this.csvExportService.saveAsCsvFile(this.exportDataList, 'employee', options);
  }

  exportXLS(): void {
    this.excelExportService.exportAsExcelFile(this.exportDataList, "employee");
  }

}
