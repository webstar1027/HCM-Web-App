import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Configuration } from "../../configuration";
import { WorkflowTemplate } from "../../models/workflow";
import { Observable } from "rxjs/Observable";

@Injectable()
export class WorkflowManagementService {
  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Configuration) private config: Configuration
  ) {}

  getWorkflowList(): Observable<WorkflowTemplate[]> {
    const url = this.config.ApiBaseUrl + "api/WorkflowManagement";
    return this.http.get<WorkflowTemplate[]>(url);
  }

  getWorkflowById(workflowId: number): Observable<WorkflowTemplate> {
    const url = this.config.ApiBaseUrl + "api/WorkflowManagement/" + workflowId;
    return this.http.get<WorkflowTemplate>(url);
  }

  saveWorkflow(
    workflowTemplate: WorkflowTemplate
  ): Observable<WorkflowTemplate> {
    const url = this.config.ApiBaseUrl + "api/WorkflowManagement";
    return this.http.post<WorkflowTemplate>(url, workflowTemplate);
  }

  activateDeactivateWorkflow(workflowId: number): Observable<WorkflowTemplate> {
    const url =
      this.config.ApiBaseUrl +
      "api/WorkflowManagement/ActivateDeactiveWorkflow/" +
      workflowId.toString();
    return this.http.post<WorkflowTemplate>(url, null);
  }
}
