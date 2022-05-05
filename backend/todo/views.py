from django.shortcuts import render
from rest_framework import permissions, viewsets

from todo.models import Task, Todo
from todo.serializers import TaskSerializer, TodoSerializer
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class TaskWritePermission(permissions.BasePermission):
    #message = 'Editing task is restricted to the author only.'

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class TaskViewSet(viewsets.ModelViewSet, TaskWritePermission):
    permission_classes = [
        permissions.IsAuthenticated,
        TaskWritePermission
    ]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['todoItem']

class TodoViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['project']
