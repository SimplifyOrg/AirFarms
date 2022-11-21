from .models import User, ProfilePicture
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')
        extra_kwargs = {'password': {'write_only': True}}
    # Create new user
    def create(self, validated_data):
        user = User(
            email = validated_data['email'],
            username = validated_data['username'],
            phonenumber = validated_data['phonenumber'],
            password = make_password(validated_data['password']),
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            about = validated_data['about'],
            location = validated_data['location'],
            birth_date = validated_data['birth_date'],
        )
        user.save()
        return user

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = ('__all__')

# class GroupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Group
#         fields = ('__all__')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({'user': UserSerializer(self.user).data})
        try:
            data.update({'profilepicture': self.user.profilepicture.image.url})
        except:
            data.update({'profilepicture': 'undefined'})
        # and everything else you want to send in the response
        return data


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
 