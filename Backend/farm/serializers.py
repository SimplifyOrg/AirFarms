
from ast import Not
from .models import Farm, FarmDiscussionBoard, FarmGroups, FarmPicture
from rest_framework import serializers
from django.contrib.auth.models import Group


class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ('id', 'name', 'description', 'user', 'date_created', 'archived')
    def create(self, validated_data):
        farm = Farm(
            name = validated_data['name'],
            description = validated_data['description'],
            user = validated_data['user'],
            date_created = validated_data['date_created'],
        )
        farm.save()
        farm_group, created = FarmGroups.objects.get_or_create(
                                                                name=farm.name+'_group',
                                                                defaults={'farm': farm},
                                                                )
        if created:
            # farm_group.user_set.add(farm.user)
            farm.user.groups.add(farm_group)
        return farm


class FarmPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmPicture
        fields = ('__all__')
        #fields = ('id', 'farm', 'image', 'description', 'profilePicture')

class FarmDiscussionBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmDiscussionBoard
        fields = ('__all__')

class FarmGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmGroups
        fields = ('__all__')

    def validate(self, data):
        """
        Check that start is before finish.
        """
        
        return data