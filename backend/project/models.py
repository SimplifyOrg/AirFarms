from django.db import models
from django.db.models.fields import DateTimeField, TextField
from django.db.models.fields.related import ForeignKey, ManyToManyField
from accounts.models import User
from django.utils import timezone
from dashboard.models import DiscussionBoard

from farms.models import Farm

# Create your models here.
class Project(models.Model):
    LEVEL = (
      (1,  ('Segement level project')),
      (2, ('Farm level project')),
      (3, ('Archived - not available anymore')),
   )
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=256, default='New Project')
    completion_date = DateTimeField(default=timezone.now)
    notes = TextField(blank=True)
    users = ManyToManyField(User)
    farm = ForeignKey(Farm, on_delete=models.CASCADE)
    state = models.PositiveSmallIntegerField(
       choices=LEVEL,
       default=1,
   )

class ProjectDiscussionBoard(DiscussionBoard):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)