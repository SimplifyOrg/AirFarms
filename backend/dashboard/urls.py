#from actstream.feeds import CustomJSONActivityFeed

#url(r'^feeds/mystream/(?P<verb>.+)/$',
#    CustomJSONActivityFeed.as_view(name='mystream'))

#urlpatterns = [
#    path('feeds/stream/<verb>/', )

from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers
from .views import CommentPictureViewSet, CreatePostView, PostListView, PostPermissionView, PostPictureViewSet, PostView, CreateCommentView, CommentView, UpdateCommentView, UpdatePostView

router = routers.DefaultRouter()
router.register(r'comments/handle', CommentPictureViewSet)
router.register(r'posts/handle', PostPictureViewSet)

urlpatterns = [
	#path('', CreatePostView.as_view(), name='home'),
	path('post/new/', CreatePostView.as_view(), name='post-create'),
	path('post/update/<int:pk>/', UpdatePostView.as_view(), name='post-update'),
	path('post/<int:pk>/', PostView.as_view(), name='post-detail'),
    path('posts/get/', PostListView.as_view(), name='post-list'),
	path('comment/new/', CreateCommentView.as_view(), name='comment-create'),
	path('comments/get/', CommentView.as_view(), name='comment-detail'),
    path('comments/update/<int:pk>/', UpdateCommentView.as_view(), name='comment-update'),
    path('comments/get/<int:pk>/', PostPermissionView.as_view(), name='comment-edit-permission'),
    path('picture/', include(router.urls), name='handle-picture')
	#path('like/', views.like, name='post-like'),
	#path('dislike/', views.dislike, name='post-dislike'),
	#path('post/<int:pk>/update/', PostUpdateView.as_view(), name='post-update'),
	#path('post/<int:pk>/delete/', views.post_delete, name='post-delete'),
	#path('search_posts/', views.search_posts, name='search_posts'),
	#path('user_posts/<str:username>', UserPostListView.as_view(), name='user-posts'),
	#path('load/subscription/', views.load_subscriptions, name='ajax_load_subscription'),
]
