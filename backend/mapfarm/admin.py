from django.contrib.gis import admin
from .models import FarmMap, FarmSegment

# Register your models here.

admin.site.register(FarmMap, admin.GeoModelAdmin)

admin.site.register(FarmSegment, admin.GeoModelAdmin)
#class FarmSegmentAdmin(OSMGeoAdmin):
    #pass
    #list_display = ('name', 'segmentShape', 'area', 'created', 'updated')
