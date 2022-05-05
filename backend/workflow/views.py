from django.shortcuts import render
from rest_framework import permissions, viewsets, generics
from .serializers import JSONWorkflowSerializer, WorkflowSerializer, WorkSerializer, StateSerializer, TransitionSerializer, TransitionApprovalSerializer
from .models import JSONWorkflow, Workflow, Work, State, Transition, TransitionApproval
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
class WorkflowViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer

class WorkViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Work.objects.all()
    serializer_class = WorkSerializer

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
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'workflow']