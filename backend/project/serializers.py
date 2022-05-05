from .models import Project, ProjectDiscussionBoard
from rest_framework import serializers

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('__all__')


class ProjectDiscussionBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDiscussionBoard
        fields = ('__all__')
 