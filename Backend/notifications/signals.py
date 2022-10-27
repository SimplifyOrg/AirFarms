from django.db.models.signals import post_save

from account.models import User
from .models import NotificationData
from django.dispatch import receiver
from channels.layers import get_channel_layer
from django.core.serializers.json import DjangoJSONEncoder
import json

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