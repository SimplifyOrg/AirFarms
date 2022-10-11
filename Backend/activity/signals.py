from django.db.models.signals import post_save
from .models import JSONWorkflow, State, Transition, TransitionApproval, Work, Workflow
from django.dispatch import receiver
import json

def CreateTransition(transition):
    Transition.create(transition)

def CreateTransitionApproval(transitionApproval):
    TransitionApproval.create(transitionApproval)

def CreateState(node):
    State.create(node)

def CreateWork(work):
    Work.create(work)

def SetCurrentStates(current):
    Workflow.update(current)

@receiver(post_save, sender=JSONWorkflow)
def JSONWorkflowHandler(sender, instance, created, **kwargs):
    if created:
        #Create entrie flow here
        flow = json.load(instance.jsonFlow)
        for node in flow.nodes:
            CreateState(node=node)
        

# @receiver(post_save, sender=Workflow)
# def InitializeWorkflow(sender, instance, created, **kwargs):
#     if created:
#         start = State.objects.create(title="Start")
#         #owner = User.objects.filter(id=instance.owner).get()
#         start.notifiers.add(instance.owner)
#         end = State.objects.create(title="End")
#         end.notifiers.add(instance.owner)
#         instance.currentStates.add(start)
#         Transition.objects.create(previous=start, next=end, associatedFlow=instance)