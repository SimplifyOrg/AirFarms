from django.contrib import admin

from activity.models import JSONWorkflow, State, Transition, TransitionApproval, Work, Workflow

# Register your models here.
admin.site.register(State)
admin.site.register(Workflow)
admin.site.register(TransitionApproval)
admin.site.register(Transition)
admin.site.register(Work)
admin.site.register(JSONWorkflow)