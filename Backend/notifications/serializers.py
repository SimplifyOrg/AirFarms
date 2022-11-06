from rest_framework import serializers
from account.models import User
from .models import NotificationData

class NotificationsListSerializer(serializers.ModelSerializer):
    # receiver = serializers.SerializerMethodField()    
    class Meta:
        model = NotificationData
        fields = ('__all__')

    # def __init__(self, *args, **kwargs):
    #     notification_user = User.objects.get(id = int(kwargs['data']['receiver']))#kwargs.pop('receiver')
    #     super().__init__(*args, **kwargs)
    #     #super(CreatePostSerializer, self).__init__(*args, **kwargs)
    #     if notification_user:
    #         self.fields['receiver'].queryset = NotificationData.objects.filter(receiver_id=notification_user.id)
    
    # def validate(self, data):
    #     receivers = self.fields['receiver'].queryset.get()
    #     notifications = NotificationData.objects.filter(receiver=receivers, user_has_seen=False)
    #     if notifications:
    #         return notifications
    #     raise serializers.ValidationError("Invalid Details.")