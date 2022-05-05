from django.urls import path, include
from . import views

#app_name = 'mapfarm'

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'mapfarm/handle', views.FarmMapViewSet)

urlpatterns = [
	# path('farm-map/<int:pk>', views.map, name="farm-map"),
	# path('save-shape/<int:pk>', views.savePolygon, name="save-shape"),
	# path('farm-dashboard/<int:pk>', views.showDashboard, name="farm-dashboard"),
    path('', include(router.urls), name='handle-farm-map'),
	]
