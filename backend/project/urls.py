from django.urls import path, include, re_path
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'project/handle', views.ProjectViewSet)
#router.register(r'projectlist/handle', views.ProjectList)
router.register(r'project/discussion/handle', views.ProjectDiscussionBoardViewSet)

urlpatterns = [
    path('', include(router.urls), name='handle-project'),
    path('project/instances/', views.ProjectList.as_view(), name="instances"),
    #re_path('^instances(?P<farm>.+)/$', views.ProjectList.as_view()),
	]