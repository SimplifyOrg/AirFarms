from django.db import models
from django.utils import timezone
from account.models import User
from discussion.models import DiscussionBoard
from django.contrib.auth.models import Group

# Create your models here.
class Farm(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True,blank=True)
    date_created = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    archived = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'name', 'archived')

    def __unicode__(self):
        return self.name

class FarmDiscussionBoard(DiscussionBoard):
    farm = models.OneToOneField(Farm, on_delete=models.CASCADE)

class FarmPicture(models.Model):
    farm = models.ForeignKey(
                            Farm,
                            on_delete=models.CASCADE
                            )
    image = models.ImageField(default='default.jpg', upload_to='farm_media')
    description = models.TextField(null=True,blank=True)
    profilePicture = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.farm.name} FarmPicture'

class FarmGroups(Group):
    farm = models.ForeignKey(
                            Farm,
                            on_delete=models.CASCADE
                            )