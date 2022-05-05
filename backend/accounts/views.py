from rest_framework import permissions
from accounts.forms import (
    SignUpForm,
    EditProfileForm
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from knox.models import AuthToken
from .serializers import (
    LoginPhoneSerializer, 
    RegisterSerializer, 
    UserSerializer, 
    ProfilePictureSerializer,
)
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.models import User, PhoneOTP
from farms.models import FarmFollowers
from django.urls import reverse_lazy
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import (
    UserChangeForm,
    PasswordChangeForm
)
# import the logging library
import logging
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
#from allauth.account.views import SignupView, LoginView, LogoutView
from django.contrib.auth.views import (
    update_session_auth_hash,
    LoginView,
    LogoutView
)
import random
from knox.auth import TokenAuthentication

# Get an instance of a logger
logger = logging.getLogger(__name__)

def sendOTP(phone):
    if phone:
        return random.randint(999, 9999)
    else:
        return False

class ValidateOTP(APIView):

    def post(self, request, *args, **kwargs):
        phone = request.data.get('phonenumber', False)
        otp = request.data.get('otp', False)

        if phone and otp:
            old = PhoneOTP.objects.filter(phone__iexact = phone)
            if old.exists():
                old = old.first()
                oldOTP = old.otp
                if str(otp) == str(oldOTP):
                    old.validated = True
                    old.save()
                    return Response({
                        'status' : True,
                        'detail' : 'OTP verified' 
                    })                
                else:
                    return Response({
                        'status' : False,
                        'detail' : 'OTP incorrect'
                    })
            else:
                return Response({
                    'status' : False,
                    'detail' : 'Validate phone using OTP'
                })
        else:
            return Response({
                'status' : False,
                'detail' : 'Phone number not registered'
            })


class ValidatePhoneSendOTP(APIView):

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phonenumber')
        if phone_number:
            phonenumber = str(phone_number)
            user = User.objects.filter(phone__iexact=phonenumber)
            if user.exists():
                return Response({
                    'status' : False,
                    'detail' : 'Phone number already registered'
                })
            else:
                key = sendOTP(phonenumber)
                if key:
                    oldKey = PhoneOTP.objects.filter(phone__iexact = phonenumber)
                    if oldKey.exists():
                        oldKey = oldKey.first()
                        count = oldKey.count
                        if count > 10:
                            return Response({
                                'status' : False,
                                'detail' : 'OTP Limit exceeded'
                            })
                        else:
                            oldKey.count = count + 1
                            oldKey.save()
                            return Response({
                                'status' : True,
                                'detail' : 'OTP sent successfully'
                            })

                    PhoneOTP.objects.create(
                        phonenumber=phonenumber,
                        otp=key
                    )
                    return Response({
                        'status' : True,
                        'detail' : 'OTP sent successfully'
                    })
                
                else:
                    return Response({
                        'status' : False,
                        'detail' : 'Error in sending OTP'
                    })

        else:
            return Response({
                'status' : False,
                'detail' : 'Phone number not provided'
            })


class SignUpView(generics.GenericAPIView):

    #permission_classes = (IsAuthenticated, )
    def post(self, request, *args, **kwargs):
        newUser = RegisterSerializer(data=request.data)
        if newUser.is_valid(raise_exception=True):
            newUser.save()
            return Response({
                'status' : True,
                'detail' : 'User registered'
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
        return Response(newUser.errors)

# class LoginUsernameView(APIView):

#     #permission_classes = (IsAuthenticated, )
#     def post(self, request, *args, **kwargs):
#         newUser = RegisterSerializer(data=request.data)
#         if newUser.is_valid(raise_exception=True):
#             newUser.save()
#             return Response({
#                 'status' : True,
#                 'detail' : 'User registered'
#             },
#             headers={
#                 'Access-Control-Allow-Origin': '*',
#                 'Access-Control-Allow-Methods': 'POST',
#                 'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
#             })
#         return Response(newUser.errors)

# class UserAboutView(generics.RetrieveAPIView):
#     permission_classes = [
#         permissions.IsAuthenticated,
#     ]
#     serializer_class = UserAboutSerializer

#     def get(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data
#         return Response({
#             "about": user.about #UserSerializer(user, context=self.get_serializer_context()).data
#         })

class UserAPIView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "picture": user.profilepicture.image.url
        })

# class LoginView(KnoxLoginView):
#     permission_classes = (permissions.AllowAny,)

#     def post(self, request, format=None):
#         serializer = AuthTokenSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         login(request, user)
#         return super(LoginView, self).post(request, format=None)

class LoginPhoneView(generics.GenericAPIView):
    serializer_class = LoginPhoneSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [
            permissions.AllowAny,
        ]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "picture": user.profilepicture.image.url,
            "airfarms_access_token": AuthToken.objects.create(user)[1]
        })
        #res.set_cookie('airfarms_refresh_token', AuthToken.objects.create(user)[2])
        #res.set_cookie('airfarms_access_token', AuthToken.objects.create(user)[1], samesite='none')
        #return res

# def SignUp(request):
#     if request.method == 'POST':
#         form = SignUpForm(request.POST)
#         if form.is_valid(): 
#             form.save()
#             return redirect('accounts:view_profile')
#         else:
#             return redirect('accounts:change_password')
#     else:
#         form = SignUpForm()
#         args = {'form' : form}
#         return render(request, 'home/account/signup.html', args)

@login_required
def load_farms_followed(request):
    user = request.user
    farmsfollowed = FarmFollowers.objects.filter(follower=user)
    #logger.info('Farms being followed: %d', (farmsfollowed.count))
    return render(request, 'home/account/farmfollowed.html', {'farmsfollowed': farmsfollowed})

@login_required
def ViewProfile(request):
    args = {'user': request.user}
    return render(request, 'home/account/profile.html', args)

@login_required
def EditProfile(request):
    if request.method == 'POST':
        form = EditProfileForm(request.POST, instance=request.user)

        if form.is_valid():
            form.save()
            return redirect('/accounts/profile')
    else:
        form = EditProfileForm(instance=request.user)
        args = {'form' : form}
        return render(request, 'home/account/edit_profile.html', args)

@login_required
def ChangePassword(request):
    if request.method == 'POST':
        form = PasswordChangeForm(data=request.POST, user=request.user)

        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return redirect('accounts:view_profile')
        else:
            return redirect('accounts:change_password')
    else:
        form = PasswordChangeForm(user=request.user)
        args = {'form' : form}
        return render(request, 'home/account/password_change.html', args)

#class AirFarmsSignupView(SignupView):
#    form_class = SignUpForm
#    success_url = reverse_lazy('home')
#    template_name = 'home/account/signup.html'

class AirFarmsLoginView(LoginView):
    template_name = 'home/account/login.html'

class AirFarmsLogoutView(LogoutView):
    success_url = reverse_lazy('home')
    template_name = 'home/account/logout.html'
