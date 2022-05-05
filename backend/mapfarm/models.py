from django.contrib.gis.db import models
from farms.models import Farm
import datetime

# Create your models here.

class FarmMap(models.Model):
    farm = models.OneToOneField(Farm, on_delete=models.CASCADE)
    created = models.DateField(editable=False)
    updated = models.DateTimeField(editable=False)
    area = models.FloatField(default=0.0)
    farmBoundary = models.PolygonField(srid=4326, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = datetime.date.today()
        self.updated = datetime.datetime.today()
        #self.area = self.farmBoundary.transform(27700, clone=False).area
        super(FarmMap, self).save(*args, **kwargs)

class FarmSegment(models.Model):
    farmMap = models.ForeignKey(
                            FarmMap,
                            related_name='farmMap',
                            on_delete=models.CASCADE
                            )
    description = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    segmentShape = models.PolygonField(srid=4326)
    area = models.FloatField(default=0.0)
    created = models.DateField(editable=False)
    updated = models.DateTimeField(editable=False)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = datetime.date.today()
        self.updated = datetime.datetime.today()
        self.area = self.segmentShape.transform(27700, clone=False).area
        super(FarmSegment, self).save(*args, **kwargs)
