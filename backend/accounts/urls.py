from django.urls import path, include
from . import views
from django.urls import reverse_lazy
from knox.views import LogoutView
from django.contrib.auth.views import (
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView
)
#from rest_framework.authtoken.views import obtain_auth_token

app_name = 'accounts'

urlpatterns = [
    #path('api/token/', obtain_auth_token, name='obtain-token'),
    path('validate/phone/', views.ValidatePhoneSendOTP.as_view(), name='validatephone'),
    path('validate/otp/<int>', views.ValidateOTP.as_view(), name='validateotp'),
    #path('signup/', include('rest_auth.registration.urls'), name='signup'),
    #path('', include('knox.urls')),
    path('user/', views.UserAPIView.as_view()),
    #path('about/', views.UserAboutView.as_view()),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    #path('login/username', views.LoginUsernameView.as_view(), name='login_username'),
    path('login', views.LoginPhoneView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    #path('login/', views.AirFarmsLoginView.as_view(), name='login'),
    #path('logout/', views.AirFarmsLogoutView.as_view(), name='logout'),
    path('profile/', views.ViewProfile, name='view_profile'),
    path('profile/followed-farms', views.load_farms_followed, name='view_followed_farms'),
    path('profile/edit', views.EditProfile, name='edit_profile'),
    # path('change_password/', views.ChangePassword, name='change_password'),
    # path('reset_password/', PasswordResetView.as_view(
    #                         template_name='home/account/password_reset.html',
    #                         email_template_name='home/account/password_reset_email.html',
    #                         success_url=reverse_lazy('accounts:password_reset_done'),
    #                         subject_template_name='home/account/email/password_reset_key_subject.txt',
    #                     ), name='reset_password'),
    # path('reset_password/done/', PasswordResetDoneView.as_view(
    #                         template_name='home/account/password_reset_done.html'
    #                     ), name='password_reset_done'),
    # path('reset_password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(
    #                         template_name='home/account/password_set.html',
    #                         success_url=reverse_lazy('accounts:password_reset_complete'),
    #                     ), name='password_reset_confirm'),
    # path('reset_password/complete/', PasswordResetCompleteView.as_view(
    #                         template_name='home/account/password_reset_from_key_done.html'
    #                     ), name='password_reset_complete'),
]
