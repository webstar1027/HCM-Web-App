import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToasterService } from "angular2-toaster";

import { WorkflowManagementService } from "../../../../core/services/managment/workflow-management-service";
import { LookupService } from "../../../../core/services/components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { Lookup } from "../../../../core/models/lookup";
import {
  WorkflowTemplate,
  WorkflowTemplateStep
} from "../../../../core/models/workflow";

@Component({
  selector: "app-worklofw-management-edit",
  templateUrl: "./workflow-edit.component.html"
})

export class WorkflowEditComponent implements OnInit {
  workflowStatus: Lookup[];
  workflowTypes: Lookup[];
  workflowDetails: WorkflowTemplate;
  private workflowId: number;
  savingData = false;
  private changingStatus = false;
  private newStepName: string = null;
  private selectedWorkflowTemplate: WorkflowTemplateStep;
  private canDragAndDropStepActions = true;
  private selectedStepActionIndex = 0;

  constructor(
    private helperService: LookupService,
    private workflowManagementService: WorkflowManagementService,
    private route: ActivatedRoute,
    public toasterService: ToasterService
  ) {}

  //#region " *  Load and Save from the server * "

  saveWorkflow(): void {
    this.savingData = true;
    this.workflowManagementService.saveWorkflow(this.workflowDetails).subscribe(
      e => {
        this.workflowDetails = e;
        this.toasterService.pop(
          "success",
          "success",
          "Workflow saved successful"
        );
      },
      er => {
        console.log(er.error.Message);
        this.toasterService.pop("error", "Error", "Could not save workflow");
      },
      () => {
        this.savingData = false;
      }
    );
  }

  activateDeactivateWorkflow() {
    this.changingStatus = true;
    this.workflowManagementService
      .activateDeactivateWorkflow(this.workflowId)
      .subscribe(
        e => {
          this.workflowDetails = e;
          this.loadEnumValue();
        },
        fail => {
          console.log(
            "Error-Loading: Could not load from service " + fail.toString()
          );
        },
        () => {
          this.changingStatus = false;
        }
      );
  }

  loadWorkflow() {
    this.workflowManagementService.getWorkflowById(this.workflowId).subscribe(
      e => {
        // debugger;
        this.workflowDetails = new WorkflowTemplate(
          e.workflowTemplateId,
          e.workflowName,
          e.workflowTypeId,
          e.workflowTemplateStatusId,
          e.workflowTemplateSteps
        );
        this.loadEnumValue();
        this.workflowDetails.workflowTemplateSteps = new Array();
        this.workflowDetails.workflowTemplateSteps.push(
          new WorkflowTemplateStep(
            1,
            "Test 1",
            this.workflowDetails.workflowTemplateId,
            null
          )
        );
        this.workflowDetails.workflowTemplateSteps.push(
          new WorkflowTemplateStep(
            2,
            "Get Insurance information",
            this.workflowDetails.workflowTemplateId,
            null
          )
        );
      },
      fail => {
        console.log(
          "Error-Loading: Could not load from service " + fail.toString()
        );
      }
    );
  }

  loadEnumValue() {
    this.helperService
    .getEnumNameValueLookup(LookupTypesEnum.WorkflowTemplateTypeEnum)
    .subscribe(e => {
      this.workflowTypes = e;
      if (this.workflowDetails.workflowTemplateId > 0) {
        this.workflowDetails.workflowTypeId =
          e.length === 1 ? +e[0].key : this.workflowDetails.workflowTypeId;
      }
    });
  }

  //#endregion

  //#region " * Local null checking And Action Allowance * "

  templateIsActive(): boolean {
    const isActive = this.workflowDetails.workflowTemplateStatusId === 2;
    return isActive;
  }

  hasSelectedWorkflowStep(): boolean {
    return (
      typeof this.selectedWorkflowTemplate !== "undefined" &&
      typeof this.selectedWorkflowTemplate.workflowTemplateStepActions !==
        "undefined"
    );
  }

  isSelectedStep(selectedStep: WorkflowTemplateStep): boolean {
    try {
      if (!selectedStep) {
        return false;
      }
      if (!this.selectedWorkflowTemplate) {
        return false;
      }

      return (
        this.selectedWorkflowTemplate.workflowTemplateStepId ===
        selectedStep.workflowTemplateStepId
      );
    } catch (e) {
      return false;
    }
  }

  canMoveActionStepDown(): boolean {
    if (
      this.selectedStepActionIndex < 0 ||
      !this.selectedWorkflowTemplate ||
      !this.selectedWorkflowTemplate.workflowTemplateStepActions
    ) {
      return false;
    }
    return (
      this.selectedStepActionIndex <
      this.selectedWorkflowTemplate.workflowTemplateStepActions.length - 1
    );
  }

  canMoveActionStepUp(): boolean {
    if (
      this.selectedStepActionIndex <= 0 ||
      !this.selectedWorkflowTemplate ||
      !this.selectedWorkflowTemplate.workflowTemplateStepActions
    ) {
      return false;
    }
    return (
      this.selectedWorkflowTemplate.workflowTemplateStepActions.length >
      this.selectedStepActionIndex
    );
  }

  //#endregion

  // #region  " * Local Action Methods * "

  selectTemplateStep(templateStep: WorkflowTemplateStep): void {
    const isNew = !this.selectedWorkflowTemplate;
    this.selectStepAction(-1);
    if (
      isNew === false &&
      templateStep.workflowTemplateStepId ===
        this.selectedWorkflowTemplate.workflowTemplateStepId
    ) {
      return;
    }
    this.selectedWorkflowTemplate = templateStep;
  }

  moveElementInArray(
    array: Array<any>,
    value: any,
    positionChange: number
  ): Array<any> {
    const oldIndex = array.indexOf(value);
    if (oldIndex <= -1) {
      return array;
    }

    if (positionChange < 0) {
      positionChange = 0;
    } else if (positionChange === array.length) {
      positionChange = array.length;
    } else if (positionChange > array.length) {
      return array;
    }

    const arrayClone = array.slice();
    arrayClone.splice(oldIndex, 1);
    arrayClone.splice(positionChange, 0, value);

    return arrayClone;
  }

  addStep(): void {
    if (!this.workflowDetails || !this.workflowDetails.workflowTemplateSteps) {
      return;
    }
    this.workflowDetails.workflowTemplateSteps.push(
      new WorkflowTemplateStep(
        0,
        this.newStepName,
        this.workflowDetails.workflowTemplateId,
        null
      )
    );
    this.newStepName = null;
    // this.toasterService.popAsync("success", "Success", "Workflow saved successful");
  }

  removeStep(workflowTemplateStep: WorkflowTemplateStep): void {
    const stepElementIndex = this.workflowDetails.workflowTemplateSteps.indexOf(
      workflowTemplateStep
    );
    if (stepElementIndex < 0) {
      return;
    }
    this.workflowDetails.workflowTemplateSteps.splice(stepElementIndex, 1);
  }

  selectStepAction(selectedItem: number) {
    this.selectedStepActionIndex = selectedItem;
  }

  movePositionUp() {
    if (!this.canMoveActionStepDown() && !this.canMoveActionStepUp()) {
      return;
    }
    const endNumber =
      this.selectedStepActionIndex === 0 ? 0 : this.selectedStepActionIndex - 1;
    const affectedElement = this.selectedWorkflowTemplate
      .workflowTemplateStepActions[this.selectedStepActionIndex];
    affectedElement.sequence = this.selectedStepActionIndex;

    this.selectedWorkflowTemplate.workflowTemplateStepActions[
      endNumber
    ].sequence =
      this.selectedStepActionIndex + 1;

    this.selectedWorkflowTemplate.workflowTemplateStepActions = this.moveElementInArray(
      this.selectedWorkflowTemplate.workflowTemplateStepActions,
      affectedElement,
      endNumber
    );

    this.selectedStepActionIndex = endNumber;
  }

  movePositionDown() {
    if (!this.canMoveActionStepDown() && !this.canMoveActionStepUp()) {
      return;
    }
    const startNumber =
      this.selectedStepActionIndex === 0 ? 0 : this.selectedStepActionIndex;
    const newSequence: number = this.selectedStepActionIndex + 2;

    const affectedElement = this.selectedWorkflowTemplate
      .workflowTemplateStepActions[startNumber];

    affectedElement.sequence = newSequence;

    this.selectedWorkflowTemplate.workflowTemplateStepActions[
      this.selectedStepActionIndex + 1
    ].sequence =
      this.selectedStepActionIndex + 1;

    this.selectedWorkflowTemplate.workflowTemplateStepActions = this.moveElementInArray(
      this.selectedWorkflowTemplate.workflowTemplateStepActions,
      affectedElement,
      this.selectedStepActionIndex + 1
    );

    this.selectedStepActionIndex += 1;
  }

  //#endregion

  //#region " * Base Overides * "
  ngOnInit() {
    this.helperService
      .getEnumNameValueLookup(LookupTypesEnum.WorkflowTemplateStatusEnum)
      .subscribe(
        e => {
          this.workflowStatus = e;
        },
        f => {
          console.log(
            "Error-Loading: Could not load from service " + f.toString()
          );
        }
      );

    this.route.params.subscribe(params => {
      this.workflowId = +params.templateId;
      this.loadWorkflow();
    });
  }
  //#endregion
}
