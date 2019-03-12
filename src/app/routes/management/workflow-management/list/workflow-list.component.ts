import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { WorkflowTemplate } from "../../../../core/models/workflow";
import { WorkflowManagementService } from "../../../../core/services/managment/workflow-management-service";

@Component({
  templateUrl: "./workflow-list.component.html"
})
export class WorkflowListComponent implements OnInit {
  workflowTemplates: WorkflowTemplate[];
  loadingData = false;

  constructor(
    private _workflowManagementService: WorkflowManagementService,
    private router: Router
  ) {}

  loadWorkflowTemplateList() {
    this.loadingData = true;
    this._workflowManagementService.getWorkflowList().subscribe(
      e => {
        this.workflowTemplates = e;
      },
      e => {
        this.loadingData = false;
      },
      () => {
        this.loadingData = false;
      }
    );
  }

  editWorkflowTemplate(id) {
    const link = ["/management/workflow/edit", id];
    this.router.navigate(link);
  }

  ngOnInit() {
    this.loadWorkflowTemplateList();
  }
}
