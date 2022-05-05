
from ast import Not
from .models import Farm, FarmDiscussionBoard, FarmPicture
from rest_framework import serializers


class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ('id', 'name', 'description', 'user', 'date_created')


class FarmPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmPicture
        fields = ('__all__')
        #fields = ('id', 'farm', 'image', 'description', 'profilePicture')

class FarmDiscussionBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmDiscussionBoard
        fields = ('__all__')