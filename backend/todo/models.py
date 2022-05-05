from django.db import models
from django.db.models.fields import DateField, TextField
from django.db.models.fields.related import ForeignKey, ManyToManyField, OneToOneField
from django.forms import BooleanField
from django.utils import timezone
from accounts.models import User
from project.models import Project
from dashboard.models import DiscussionBoard

class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    project = OneToOneField(Project, on_delete=models.CASCADE)

# Create your models here.
class Task(DiscussionBoard):
    completion_date = DateField(default=timezone.now)
    notes = TextField(blank=True)
    assignee = ManyToManyField(User)
    notifiers = ManyToManyField(User, blank=True, related_name='noticer')
    todoItem = ForeignKey(Todo, on_delete=models.CASCADE)
    has_completed = models.BooleanField(default=False)