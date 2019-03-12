import { Injectable } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Injectable()
export class CsvExportService {

    constructor() { }

    public saveAsCsvFile(json: any[], fileName: string, options: any): void {
        new Angular5Csv(json,  fileName, options);
    }

}
