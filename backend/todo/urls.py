from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'task/handle', views.TaskViewSet)
router.register(r'todo/handle', views.TodoViewSet)

urlpatterns = [
    path('', include(router.urls), name='handle-todo'),
]