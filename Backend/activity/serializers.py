from rest_framework import serializers
from .models import Execution, ExecutionTransitionApproval, ExecutionWork, ExecutionWorkDocuments, JSONWorkflow, WorkDocuments, WorkGroups, Workflow, Work, State, Transition, TransitionApproval, WorkflowTrigger

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

class WorkDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkDocuments
        fields = ('__all__')

class WorkGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkGroups
        fields = ('__all__')

class ExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execution
        fields = ('__all__')

class ExecutionWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionWork
        fields = ('__all__')

class ExecutionTransitionApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionTransitionApproval
        fields = ('__all__')

class ExecutionWorkDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionWorkDocuments
        fields = ('__all__')

class WorkflowTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowTrigger
        fields = ('__all__')