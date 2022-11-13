from django.shortcuts import render
from rest_framework import permissions, viewsets, generics
from .serializers import JSONWorkflowSerializer, WorkDocumentsSerializer, WorkflowSerializer, WorkSerializer, StateSerializer, TransitionSerializer, TransitionApprovalSerializer
from .models import JSONWorkflow, WorkDocuments, Workflow, Work, State, Transition, TransitionApproval
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
    filterset_fields = ['id', 'owner', 'farm', 'is_production', 'has_finished', 'archived']
    ordering_fields = ['title']

class WorkViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'assignee', 'completion_date', 'has_finished', 'is_halted']

class WorkDocumentsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = WorkDocuments.objects.all()
    serializer_class = WorkDocumentsSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'file', 'associatedWork']

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
    filterset_fields = ['id', 'approver', 'transitionToApprove', 'approval']

class JSONWorkflowViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = JSONWorkflow.objects.all()
    serializer_class = JSONWorkflowSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['id', 'workflow', 'farm', 'archived']
    ordering_fields = ['id','workflow']