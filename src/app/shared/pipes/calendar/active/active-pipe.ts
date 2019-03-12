import { Injector, Pipe, PipeTransform } from '@angular/core';
import { ChartContract } from '@app/core/models/interfaces/chart/IChartAuthorization';

@Pipe({name: 'active'})
export class ActivePipe  implements PipeTransform {

  constructor(private injector: Injector) {}

  transform(contractList: ChartContract[]): any {
   try {
    return contractList.filter(contract => contract["status"] === "Active");
   } catch (error) {
     
   }
  
  }

}
