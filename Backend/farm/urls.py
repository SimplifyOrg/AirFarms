from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import FarmGroupsViewSet, FarmPictureViewSet, FarmViewSet, FarmDiscussionBoardViewSet

router = routers.DefaultRouter()
# Keep farm picture on top
# Django runs through each URL pattern, in order, 
# and stops at the first one that matches the requested URL, 
# matching against path_info
router.register(r'perform/manage/farmpicture', FarmPictureViewSet, 'farmpicture')
router.register(r'perform/farm/discussionboard', FarmDiscussionBoardViewSet, 'farmdiscussion')
router.register(r'perform/manage', FarmViewSet, 'farm')
router.register(r'perform/group', FarmGroupsViewSet, 'group')
# router.register(r'list/farm/user', FarmUsersViewSet, 'farm')


urlpatterns = [
    path('', include(router.urls), name='manage-farm')
]
