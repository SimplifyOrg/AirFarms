from rest_framework import permissions, viewsets, generics
from .serializers import ChangePasswordSerializer, UserSerializer, ProfilePictureSerializer
from .models import User, ProfilePicture
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
# from django.contrib.auth.models import Group
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'groups']
    ordering_fields = ['first_name', 'last_name', 'email']

class ProfilePictureViewSet(viewsets.ModelViewSet):
    serializer_class = ProfilePictureSerializer
    queryset = ProfilePicture.objects.all()
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id', 'user']

# class GroupViewSet(viewsets.ModelViewSet):
#     serializer_class = GroupSerializer
#     queryset = Group.objects.all()
#     filter_backends = [DjangoFilterBackend,]
#     filterset_fields = ['id', 'name']

class CustomTokenObtainPairView(TokenObtainPairView):
    # Replace the serializer with your custom
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.UpdateAPIView):

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)