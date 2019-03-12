import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import "rxjs/Rx";
declare var jsPDF: any;

const PDF_EXTENSION = '.pdf';

@Injectable()
export class PdfExportService {

  constructor() { }

  public saveAsPDFFile(json: any[], fileName: string, columns: any): void {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(this.todayTextFormat(), 10, 13);

    doc.setFontSize(16);
    const listName = fileName.charAt(0).toUpperCase() + fileName.substr(1);
    doc.text(listName + " List", 90, 10);

    doc.autoTable(columns, json, {
        theme: 'grid',
        headerStyles: {
           fillColor: [28, 28 , 28]
        },

        bodyStyles: {
            color: '#1C1C1C',
            border: '1px solid rgb(29, 29, 29)'
        },

        styles: {fontSize: 10, },
        drawCell(cell, data) {
          if (data.row.index % 2 === 1) {
              doc.setFillColor(255, 255, 255);
          } else {
              doc.setFillColor(242, 242, 242);
          }
        }
    });

    doc.save(fileName + PDF_EXTENSION);
  }

  private todayTextFormat(): string {
      const today = new Date();
      let dd  = today.getDate().toString();
      let mm  = (today.getMonth() + 1).toString();
      const yyyy = today.getFullYear();

      if (today.getDate() < 10) {
         dd = '0' + dd;
      }

      if (today.getMonth() < 9) {
         mm = '0' + mm;
      }
      return mm + '/' + dd + '/' + yyyy;
  }

}
