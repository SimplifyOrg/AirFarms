from .models import FarmMap
from rest_framework_gis import serializers

class FarmMapSerializer(serializers.GeoFeatureModelSerializer):
    class Meta:
        model = FarmMap
        geo_field = "farmBoundary"
        fields = ('__all__')

        def to_representation(self, instance):
        #Convert `geom` to srid 4326."""
            ret = super().to_representation(instance)
            ret['farmBoundary'] = ret['farmBoundary'].transform(4326)
            return ret  