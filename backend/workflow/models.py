from datetime import timedelta
from email.policy import default
from django.db import models
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.db.models.fields import DateTimeField, TextField
from accounts.models import User
from django.utils import timezone
from dashboard.models import DiscussionBoard
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from farms.models import Farm

def return_date_time():
    now = timezone.now()
    return now + timedelta(weeks=1)

# Create your models here.
class State(models.Model):
    title = models.CharField(max_length=256, default='New state')
    notifiers = ManyToManyField(User, blank=True, related_name='state_notifiers')
    notes = TextField(blank=True)
    transition_date = DateTimeField(default=return_date_time)

class Workflow(models.Model):
    currentState = ForeignKey(State, null=True, blank=True, related_name='current_state', on_delete=models.CASCADE)
    has_finished = models.BooleanField(default=False)
    farm = ForeignKey(Farm, on_delete=models.CASCADE)
    owner = ForeignKey(User, on_delete=models.CASCADE)
    is_production = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super(Workflow, self).save()

class Transition(models.Model):
    previous = ForeignKey(State, related_name='previous_state', on_delete=models.CASCADE)
    next = ForeignKey(State, related_name='next_state', on_delete=models.CASCADE)
    associatedFlow = ForeignKey(Workflow, on_delete=models.CASCADE)
    need_approval = models.BooleanField(default=False)

class TransitionApproval(models.Model):
    transitionToApprove = ForeignKey(Transition, on_delete=models.CASCADE)
    approver = ForeignKey(User, on_delete=models.CASCADE)
    approval = models.BooleanField(default=False)

class Work(DiscussionBoard):
    assignee = ManyToManyField(User)
    notifiers = ManyToManyField(User, blank=True, related_name='work_notifiers')
    notes = TextField(blank=True)
    associatedState = ForeignKey(State, on_delete=models.CASCADE)
    completion_date = DateTimeField(default=timezone.now)
    start_date = DateTimeField(default=timezone.now)
    has_finished = models.BooleanField(default=False)
    is_halted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        completion_date = self.associatedState.transition_date
        super(Work, self).save()

class JSONWorkflow(models.Model):
    jsonFlow = models.JSONField()
    workflow = ForeignKey(Workflow, on_delete=models.CASCADE)
    farm = ForeignKey(Farm, on_delete=models.CASCADE)

@receiver(post_save, sender=JSONWorkflow)
def JSONWorkflowHandler(sender, instance, created, **kwargs):
    if created:
        #Create entrie flow here
        instance.workflow.farm = instance.farm

@receiver(post_save, sender=Workflow)
def InitializeWorkflow(sender, instance, created, **kwargs):
    if created:
        start = State.objects.create(title="Start")
        #owner = User.objects.filter(id=instance.owner).get()
        start.notifiers.add(instance.owner)
        end = State.objects.create(title="End")
        end.notifiers.add(instance.owner)
        instance.currentState = start
        Transition.objects.create(previous=start, next=end, associatedFlow=instance)

