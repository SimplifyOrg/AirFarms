from account.models import User
from rest_framework.filters import OrderingFilter
from .models import Farm, FarmDiscussionBoard, FarmGroups, FarmPicture
from rest_framework import viewsets, permissions
from farm.serializers import FarmDiscussionBoardSerializer, FarmGroupsSerializer, FarmPictureSerializer, FarmSerializer
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
class FarmViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter,]
    filterset_fields = ['user', 'name', 'id', 'archived']
    ordering_fields = ['date_created', 'name']


    # def get_queryset(self):
    #     return Farm.objects.filter(user_id=self.request.user.id)


class FarmPictureViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = FarmPicture.objects.all()
    serializer_class = FarmPictureSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'farm']

    def retrieve(self, request, *args, **kwargs):
        farm_id = kwargs.get('farm_id', None)
        farm_obj = Farm.objects.get(id=farm_id)
        self.queryset = FarmPicture.objects.filter(farm=farm_obj).distinct()
        return super(FarmPictureViewSet, self).retrieve(request, *args, **kwargs)

class FarmDiscussionBoardViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = FarmDiscussionBoard.objects.all()
    serializer_class = FarmDiscussionBoardSerializer
    lookup_field = 'farm'

class FarmGroupsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = FarmGroups.objects.all()
    serializer_class = FarmGroupsSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'name', 'farm']

    # def retrieve(self, request, *args, **kwargs):
    #     farm_id = kwargs.get('farm', None)
    #     farm_obj = Farm.objects.get(farm=farm_id)
    #     self.queryset = FarmGroups.objects.filter(farm=farm_obj).distinct()
    #     return super(FarmGroupsViewSet, self).retrieve(request, *args, **kwargs)
# class FarmUsersViewSet(viewsets.ModelViewSet):
#     permission_classes = [
#         permissions.IsAuthenticated,
#     ]
#     #parser_classes = (MultiPartParser, FormParser)
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     lookup_field = 'farm_id'

#     def retrieve(self, request, *args, **kwargs):
#         farm_id = kwargs.get('farm_id', None)
#         farm_obj = Farm.objects.get(id=farm_id)
#         self.queryset = User.objects.filter(groups__name=farm_obj.name).distinct()
#         # self.queryset = User.objects.filter(farm=farm_obj).distinct()
#         return super(FarmUsersViewSet, self).retrieve(request, *args, **kwargs)