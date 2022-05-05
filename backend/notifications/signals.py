from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from .models import NotificationData
from channels.layers import get_channel_layer
from django.core.serializers.json import DjangoJSONEncoder
import json

# def get_notifications(receiver):
#     rece = User.objects.filter(id=receiver)
#     notifications = NotificationData.objects.filter(receiver=rece.get(), user_has_seen=False)
#     return json.dumps(list(notifications.values()), cls=DjangoJSONEncoder)



#post_save.connect(SendNotification, sender=NotificationData)