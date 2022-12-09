from django.shortcuts import render
from rest_framework import permissions, viewsets, generics
from .serializers import ExecutionSerializer, ExecutionTransitionApprovalSerializer, ExecutionWorkDocumentsSerializer, ExecutionWorkSerializer, JSONWorkflowSerializer, WorkDocumentsSerializer, WorkGroupsSerializer, WorkflowSerializer, WorkSerializer, StateSerializer, TransitionSerializer, TransitionApprovalSerializer, WorkflowTriggerSerializer
from .models import Execution, ExecutionTransitionApproval, ExecutionWork, ExecutionWorkDocuments, JSONWorkflow, WorkDocuments, WorkGroups, Workflow, Work, State, Transition, TransitionApproval, WorkflowTrigger
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

# Create your views here.
class WorkflowViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter,]
    filterset_fields = ['id', 'owner', 'farm', 'is_production', 'archived']
    ordering_fields = ['title']

class WorkViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'assignee', 'duration', 'associatedState']

class WorkDocumentsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = WorkDocuments.objects.all()
    serializer_class = WorkDocumentsSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'associatedWork']

class StateViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = State.objects.all()
    serializer_class = StateSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id']

class TransitionViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Transition.objects.all()
    serializer_class = TransitionSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'previous', 'next', 'associatedFlow']

class TransitionApprovalViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = TransitionApproval.objects.all()
    serializer_class = TransitionApprovalSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'approver', 'transitionToApprove']

class JSONWorkflowViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = JSONWorkflow.objects.all()
    serializer_class = JSONWorkflowSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'workflow', 'farm', 'archived']
    ordering_fields = ['id','workflow']

class WorkGroupsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = WorkGroups.objects.all()
    serializer_class = WorkGroupsSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'associatedFlow', 'name']
    ordering_fields = ['id','associatedFlow', 'name']

class ExecutionViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Execution.objects.all()
    serializer_class = ExecutionSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'associatedFlow', 'startTime', 'endTime', 'has_finished']
    ordering_fields = ['id','associatedFlow', 'startTime', 'endTime']

class ExecutionWorkViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = ExecutionWork.objects.all()
    serializer_class = ExecutionWorkSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'assignee', 'completion_date', 'has_finished', 'is_halted', 'associatedExecution']
    ordering_fields = ['id','completion_date']

class ExecutionTransitionApprovalViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = ExecutionTransitionApproval.objects.all()
    serializer_class = ExecutionTransitionApprovalSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'associatedExecution', 'approval', 'reject']
    ordering_fields = ['id','associatedExecution']

class ExecutionWorkDocumentsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = ExecutionWorkDocuments.objects.all()
    serializer_class = ExecutionWorkDocumentsSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'associatedExecutionWork', 'title']
    ordering_fields = ['id','associatedExecutionWork', 'title']

class WorkflowTriggerViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = WorkflowTrigger.objects.all()
    serializer_class = WorkflowTriggerSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'workflowToTrigger', 'associatedState', 'creationDate']
    ordering_fields = ['id','workflowToTrigger', 'associatedState', 'creationDate']