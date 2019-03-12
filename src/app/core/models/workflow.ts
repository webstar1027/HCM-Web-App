export class WorkflowTemplate {
  constructor(
    public workflowTemplateId: number,
    public workflowName: string,
    public workflowTypeId: number,
    public workflowTemplateStatusId: number,
    public workflowTemplateSteps: WorkflowTemplateStep[]
  ) {}
}

export class WorkflowTemplateStep {
  constructor(
    public workflowTemplateStepId: number,
    public stepName: string,
    public workflowTemplateId: number,
    public workflowTemplateStepActions: WorkflowTemplateStepAction[]
  ) {
    this.workflowTemplateStepActions = new Array();
  }
}

export class WorkflowTemplateStepAction {
  constructor(
    public workflowTemplateStepActionId: number,
    public workflowTemplateStepId: number,
    public actionTypeId: number,
    public sequence: number
  ) {}
}
