from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from rest_framework import permissions, viewsets, generics

from farms.models import Farm
from .models import Project, ProjectDiscussionBoard
from .serializers import ProjectDiscussionBoardSerializer, ProjectSerializer
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    #lookup_field = 'farm'

    def options(self, request, *args, **kwargs):    
        meta = self.metadata_class()
        data = meta.determine_metadata(request, self)
        return Response(data=data, status=HTTP_200_OK, headers={
                'Access-Control-Allow-Origin': '*'
            })

    def get_queryset(self):
        queryset = Project.objects.all()
        product = self.request.query_params.get('farm')
        if product is not None:
            queryset = queryset.filter(farm_id=product)
        return queryset

class ProjectDiscussionBoardViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = ProjectDiscussionBoard.objects.all()
    serializer_class = ProjectDiscussionBoardSerializer
    lookup_field = 'project'

class ProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['farm']

    def dispatch(self, *args, **kwargs):
        response = super(ProjectList, self).dispatch(*args, **kwargs)
        response['Access-Control-Allow-Origin'] = '*'
        return response
