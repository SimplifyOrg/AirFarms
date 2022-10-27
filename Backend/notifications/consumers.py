from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.dispatch import receiver
from account.models import User
from asgiref.sync import sync_to_async
from .serializers import NotificationsListSerializer
from .models import NotificationData
from django.core.serializers.json import DjangoJSONEncoder

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except:
        return None

@database_sync_to_async
def create_notification(receiver, sender, type=1, has_seen=False):
    notification = NotificationData.objects.create(
        receiver = receiver,
        notification_type = type,
        sender = sender,
        user_has_seen = has_seen)

    return json.dumps({
        "sender": notification.sender.id,
        "receiver": notification.receiver.id,
        "type" : notification.notification_type,
        "has_seen" : notification.user_has_seen,
        "date" : notification.date
        }, default=str)

@database_sync_to_async
def get_notifications(receiver):
    rece = User.objects.filter(id=receiver)
    notifications = NotificationData.objects.filter(receiver=rece.get(), user_has_seen=False)
    return json.dumps(list(notifications.values()), cls=DjangoJSONEncoder)

class NotificationCommunicator(AsyncWebsocketConsumer):
    async def websocket_connect(self, event):
        #self.room_name = 'notification_room'
        self.room_name = self.scope['url_route']['kwargs']['user_id'] 
        self.room_group_name = 'notification_group_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name, 
            self.channel_name)
        await self.accept()
        #TODO: retrieve all the unread notifications and send back to frontend
        notifications = await get_notifications(int(self.room_name))
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            self.room_group_name,
            {
                "type":"send_notification",
                "value": notifications
            })
        # self.send({
        #     "type":"websocket.send",
        #     "text":"room created"
        # })

    async def websocket_receive(self, event):
        data = json.loads(event['text'])
        sender = await get_user(int(data['sender']))
        receiver = await get_user(int(data['receiver']))
        get_of = await create_notification(
            sender = sender, 
            receiver = receiver, 
            type = int(data['type']))
        #self.room_group_name = 'notification_group_%s' % self.room_name
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            self.room_group_name,
            {
                "type":"send_notification",
                "value": [get_of]
            })
    
    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    async def send_notification(self, event):
        await self.send(json.dumps({
            "type":"websocket.send",
            "data": event
        }))