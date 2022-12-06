from django.contrib import admin

from activity.models import Execution, JSONWorkflow, State, Transition, TransitionApproval, Work, WorkGroups, Workflow, ExecutionWork, ExecutionTransitionApproval, ExecutionWorkDocuments, WorkflowTrigger

# Register your models here.
admin.site.register(State)
admin.site.register(Workflow)
admin.site.register(TransitionApproval)
admin.site.register(Transition)
admin.site.register(Work)
admin.site.register(JSONWorkflow)
admin.site.register(Execution)
admin.site.register(WorkGroups)
admin.site.register(ExecutionWork)
admin.site.register(ExecutionTransitionApproval)
admin.site.register(ExecutionWorkDocuments)
admin.site.register(WorkflowTrigger)