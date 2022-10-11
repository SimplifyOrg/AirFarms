from django.urls import path, include, re_path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'profilepicture', views.ProfilePictureViewSet)
# router.register(r'group', views.GroupViewSet)
#router.register(r'account/login', views.ProjectDiscussionBoardViewSet)

urlpatterns = [
    path('', include(router.urls), name='handle-project'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
	]