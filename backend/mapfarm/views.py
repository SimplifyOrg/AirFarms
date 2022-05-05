from django.shortcuts import get_object_or_404, render, redirect
from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from farms.models import Farm
from mapfarm.serializers import FarmMapSerializer
from .models import FarmMap
from .forms import NewFarmShape
from rest_framework import permissions, viewsets
import json
from django.contrib.gis.geos import GEOSGeometry
# import the logging library
import logging
# Get an instance of a logger
logger = logging.getLogger(__name__)


class FarmMapViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = FarmMap.objects.all()
    serializer_class = FarmMapSerializer
    lookup_field = 'farm_id'

    def retrieve(self, request, *args, **kwargs):
        farm_id = kwargs.get('farm_id', None)
        if farm_id is not None:
            farm_obj = Farm.objects.get(id=farm_id)
            self.queryset = FarmMap.objects.filter(farm=farm_obj).distinct()
        return super(FarmMapViewSet, self).retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        #farm_obj = Farm.objects.get(id=self.request.data.farm)
        farm_obj = serializer.validated_data.get('farm')
        #data = self.request.data.body.decode('utf-8')
        body = self.request.data.get('body')
        #data = body.decode('utf-8')
        jsonData = json.loads(body)
        farmBoundaryData=None
        for feature in jsonData['features']:
            try:
				#Save Polygon Geometry to DB
                farmBoundaryData = GEOSGeometry(str(feature['geometry']))
            except (TypeError, ValueError) as exc:
				# If the geometry_str is not a valid WKT, EWKT or HEXEWKB string
				# or is None then either continue, break or do something else.
                print(exc)
                break
            break
        serializer.save(farm=farm_obj, farmBoundary=farmBoundaryData)

# '''
# Basic view for displaying a map
# '''
# @login_required
# def map(request, pk):
# 	farm = get_object_or_404(Farm, pk=pk)

# 	lat_a = request.GET.get("lat_a")
# 	long_a = request.GET.get("long_a")

# 	#if request.method == "POST":
# 	#	form = NewFarmShape(request.POST)
# 	#	if form.is_valid():
# 	#		data = form.save(commit=False)
# 	#		#data.farmBoundary = user
# 	#		data.save()
# 	#		messages.success(request, f'Posted Successfully')
# 	#		return HttpResponseRedirect(reverse('mapfarm:farm-map', kwargs={'pk': data.id}))
# 	#		#return redirect('mapfarm:farm-map', pk=[data.id])
# 	#else:
# 	#	form = NewFarmShape()

# 	context = {
# 	"google_api_key": settings.GOOGLE_MAP_API_KEY,
# 	"lat_a": lat_a,
# 	"long_a": long_a,
# 	"origin": f'{lat_a}, {long_a}',
# 	"farm": farm,
# 	"pk": pk
# 	#"form": form
# 	}

# 	return render(request, 'home/map/map.html', context)

# @login_required
# def savePolygon(request, pk):
# 	farm = get_object_or_404(Farm, pk=pk)
# 	if request.method == 'POST':
# 		farmMap = FarmMap.objects.create(farm=farm)
# 		data = request.body.decode('utf-8')
# 		jsonData = json.loads(data)
# 		for feature in jsonData['features']:
# 			try:
# 				#Save Polygon Geometry to DB
# 				farmMap.farmBoundary = GEOSGeometry(str(feature['geometry']))
# 			except (TypeError, ValueError) as exc:
# 				# If the geometry_str is not a valid WKT, EWKT or HEXEWKB string
# 				# or is None then either continue, break or do something else.
# 				print(exc)
# 				break
# 			break
# 		farmMap.save()
# 		lat_a = request.GET.get("lat_a")
# 		long_a = request.GET.get("long_a")

# 		return HttpResponseRedirect(reverse('mapfarm:farm-dashboard', kwargs={'pk': pk}))

# @login_required
# def showDashboard(request, pk):
# 	farm = get_object_or_404(Farm, pk=pk)

# 	context = {"pk":pk}
# 	return render(request, 'home/farms/farm_dashboard.html', context)
