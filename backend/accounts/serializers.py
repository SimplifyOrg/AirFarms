from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, ProfilePicture
from django.contrib.auth.hashers import make_password
from django.db.models import Q

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'phonenumber', 'about', 'location', 'birth_date')

    def validate(self, data):
        user = User.objects.get(id=int(data['id']))
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Details.")

# class UserAboutSerializer(serializers.Serializer):
#     id = serializers.CharField()
    
#     def validate(self, data):
#         user = User.objects.filter(id=id)
#         if user and user.is_active:
#             return user
#         raise serializers.ValidationError("Invalid Details.")

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'first_name',
            'last_name',
            'email',
            'phonenumber',
            'about',
            'location',
            'birth_date',
            'password',
        )
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

# class LoginUsernameSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField()

#     def validate(self, data):
#         user = authenticate(**data)
#         if user and user.is_active:
#             return user
#         raise serializers.ValidationError("Invalid Details.")

class LoginPhoneSerializer(serializers.Serializer):
    #phone = serializers.CharField()
    password = serializers.CharField()
    username = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Details.")


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = (
            'user',
            'image'
        )