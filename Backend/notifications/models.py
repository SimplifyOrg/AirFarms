from django.db import models
from django.utils import timezone
from account.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from django.core.serializers.json import DjangoJSONEncoder
import json
# from django_celery_beat.models import IntervalSchedule, PeriodicTask
# from django_enum_choices.fields import EnumChoiceField

# Create your models here.
class NotificationData(models.Model):
    # 1=assigneed, 2=comment, 3=post, 4=added to farm
    notification_type = models.IntegerField()
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'receiver', null=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'sender', null=True)
    date = models.DateTimeField(default=timezone.now)
    user_has_seen = models.BooleanField(default=False)

    def __str__(self):
        return str(self.receiver)

