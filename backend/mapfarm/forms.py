from django.contrib.gis import forms
from .models import FarmMap, FarmSegment
from accounts.models import User

class NewFarmShape(forms.Form):
    class Meta:
        farmBoundary = forms.PointField(widget=forms.OSMWidget(attrs={'map_width': 800, 'map_height': 500}))
        #model = FarmMap
        #widgets = {'farmBoundary': forms.HiddenInput()}

        #def save(self, commit=True):
        #    farmMap = super(NewFarmShape, self).save(commit=False)
        #    farmMap.farmBoundary = self.cleaned_data['farmBoundary']

        #    if commit:
        #        farmMap.save()

        #    return farmMap
