from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'work/handle', views.WorkViewSet)
router.register(r'work-documents/handle', views.WorkDocumentsViewSet)
router.register(r'workflow/handle', views.WorkflowViewSet)
router.register(r'state/handle', views.StateViewSet)
router.register(r'transition/handle', views.TransitionViewSet)
router.register(r'transition-approval/handle', views.TransitionApprovalViewSet)
router.register(r'json-workflow/handle', views.JSONWorkflowViewSet)

urlpatterns = [
    path('', include(router.urls), name='handle-workflow'),
]