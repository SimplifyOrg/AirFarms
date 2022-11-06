from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'data/handle', views.NotificationDataViewSet)

urlpatterns = [
    path('', include(router.urls), name='notification'),
]