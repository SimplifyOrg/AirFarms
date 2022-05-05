from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views
from .views import FarmPictureViewSet, FarmUpdateView, FarmListView, FarmViewSet, SubscriptionListView, FarmDiscussionBoardViewSet

router = routers.DefaultRouter()
# Keep farm picture on top
# Django runs through each URL pattern, in order, 
# and stops at the first one that matches the requested URL, 
# matching against path_info
router.register(r'perform/manage/farmpicture', FarmPictureViewSet, 'farmpicture')
router.register(r'perform/farm/discussionboard', FarmDiscussionBoardViewSet, 'farmdiscussion')
router.register(r'perform/manage', FarmViewSet, 'farm')


urlpatterns = [
	# path('', FarmListView.as_view(), name='farm'),
	# path('farm/profile/', views.ViewFarmProfile, name='farm_profile'),
	# path('farm/new/', views.create_farm, name='farm-create'),
	# path('farm/<int:pk>/', views.post_detail_farm, name='farm-detail'),
	# path('like/', views.like, name='farm-like'),
	# path('farm/<int:pk>/update/', FarmUpdateView.as_view(), name='farm-update'),
	# path('farm/<int:pk>/delete/', views.farm_delete, name='farm-delete'),
	# path('farm/<int:pk>/follow/', views.FollowFarm, name='farm-follow'),
	# path('search_farms/', views.search_farms, name='search_farms'),
	# path('subscriptions/<str:farm>', SubscriptionListView.as_view(), name='subscriptions'),
    path('', include(router.urls), name='manage-farm')
]
