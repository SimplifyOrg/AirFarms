from rest_framework import serializers
from .models import JSONWorkflow, Workflow, Work, State, Transition, TransitionApproval

class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = ('__all__')

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = ('__all__')

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ('__all__')

class TransitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transition
        fields = ('__all__')

class TransitionApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransitionApproval
        fields = ('__all__')

class JSONWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = JSONWorkflow
        fields = ('__all__')