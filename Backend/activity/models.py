from django.db import models
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.db.models.fields import DateTimeField, TextField
from account.models import User
from discussion.models import DiscussionBoard
from farm.models import Farm, FarmGroups
from django.utils import timezone
from datetime import timedelta

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
    title = models.CharField(max_length=256, default='New workflow')
    farm = ForeignKey(Farm, on_delete=models.CASCADE)
    owner = ForeignKey(User, on_delete=models.CASCADE)
    startState = ForeignKey(State, blank=True, null=True, related_name='start_state', on_delete=models.CASCADE)
    is_production = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

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
    reject = models.BooleanField(default=False)

class WorkGroups(FarmGroups):
    associatedFlow = ForeignKey(Workflow, on_delete=models.CASCADE)

class Work(DiscussionBoard):
    assignee = ManyToManyField(WorkGroups, blank=True)
    notifiers = ManyToManyField(User, blank=True, related_name='work_notifiers')
    notes = TextField(blank=True)
    associatedState = ForeignKey(State, on_delete=models.CASCADE)
    completion_date = DateTimeField(default=return_date_time, blank=True)
    start_date = DateTimeField(default=timezone.now)
    has_finished = models.BooleanField(default=False)
    is_halted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        #completion_date = self.associatedState.transition_date
        super(Work, self).save()

class WorkDocuments(models.Model):
    title = models.CharField(max_length=256, default='New file')
    file = models.FileField(upload_to = 'files')
    associatedWork = ForeignKey(Work, on_delete=models.CASCADE)

class JSONWorkflow(models.Model):
    jsonFlow = models.JSONField()
    workflow = ForeignKey(Workflow, on_delete=models.CASCADE)
    farm = ForeignKey(Farm, on_delete=models.CASCADE)
    archived = models.BooleanField(default=False)

class Execution(DiscussionBoard):
    associatedFlow = ForeignKey(Workflow, on_delete=models.CASCADE)
    startTime = DateTimeField(default=timezone.now)
    endTime = DateTimeField(null=True, blank=True)
    has_finished = models.BooleanField(default=False)
    currentStates = ManyToManyField(State, blank=True)
    initiater = ForeignKey(User, on_delete=models.CASCADE)
