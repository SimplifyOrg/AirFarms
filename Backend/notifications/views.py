from rest_framework import permissions, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import NotificationsListSerializer
from .models import NotificationData

# Create your views here.

class NotificationDataViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = NotificationData.objects.all()
    serializer_class = NotificationsListSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'receiver', 'notification_type', 'sender', 'date', 'user_has_seen']
