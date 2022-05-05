from django.db import models
from django.utils import timezone
from accounts.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from django.core.serializers.json import DjangoJSONEncoder
import json
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from .enums import EventStatus, TimeInterval
from django_enum_choices.fields import EnumChoiceField

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

@receiver(post_save, sender=NotificationData)
def SendNotification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        notification_object = NotificationData.objects.filter(id=instance.id)
        notification = json.dumps(list(notification_object.values()), cls=DjangoJSONEncoder)
        channel_layer.group_send(
            'notification_group_%s' % instance.receiver.id,
            {
                "type":"send_notification",
                "value": notification
            })

class Event(models.Model):
    class Meta:
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
    title = models.CharField(max_length=255, blank=False)
    status = EnumChoiceField(EventStatus, default=EventStatus.active)
    created_at = models.DateTimeField(auto_now_add=True)
    interval_schedule = EnumChoiceField(TimeInterval, default=TimeInterval.five_mins)
    task = models.OneToOneField(
                PeriodicTask,
                on_delete=models.CASCADE,
                null=True,
                blank=True)
    
    def delete(self, *args, **kwargs):
        if self.task is not None:
            self.task.delete()
        
        return super(self.__class__, self).delete(*args, **kwargs)

@receiver(post_save, sender=Event)
def create_or_update_periodic_task(sender, instance, created, **kwargs):
    if created:
        instance.setup_task()
    else:
        if instance.task is not None:
            instance.task.enabled = instance.status == EventStatus.active
            instance.task.save()


def setup_task(self):
    self.task = PeriodicTask.objects.create(
                                            name=self.title,
                                            task='computation_heavy_task',
                                            interval=self.interval_schedule,
                                            args=json.dumps([self.id]),
                                            start_time=timezone.now())    
    self.save()


@property
def interval_schedule(self):
    if self.time_interval == TimeInterval.one_min:
        return IntervalSchedule.objects.get(every=1, period='minutes')
    if self.time_interval == TimeInterval.five_mins:
        return IntervalSchedule.objects.get(every=5, period='minutes')
    if self.time_interval == TimeInterval.one_hour:
        return IntervalSchedule.objects.get(every=1, period='hours')
    raise NotImplementedError