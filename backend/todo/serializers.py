from rest_framework import serializers
from todo.models import Task, Todo

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'completion_date', 'notes', 'assignee', 'notifiers', 'todoItem')

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'project')