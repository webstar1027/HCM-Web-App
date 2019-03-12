import { CriminalBackgroundCheckModel } from './criminal-background-check.model';
import { EmployeeEvaluationModel } from './employee-evaluation.model';
import { EmployeeMedicalModel } from './employee-medical.model';
import { EmployeeTrainingSchoolModel } from './employee-training-school.model';
import { EmploymentAuthorizationModel } from './employment-authorization.model';

export class EmployeeComplianceModel {
  constructor(
    public authorization: EmploymentAuthorizationModel,
    public medicals: EmployeeMedicalModel[],
    public backgroundChecks: CriminalBackgroundCheckModel[],
    public schools: EmployeeTrainingSchoolModel[],
    public evaluations: EmployeeEvaluationModel[]
  ) {
  }
}
