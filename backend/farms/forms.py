from django import forms
from .models import Farm, Subscription
from accounts.models import User

class NewFarm(forms.ModelForm):
    class Meta:
        model = Farm
        fields = ['name', 'description']

        def save(self, commit=True):
            farm = super(NewFarm, self).save(commit=False)
            farm.name = self.cleaned_data['name']
            farm.description = self.cleaned_data['description']
            farm.user = self.request.user

            if commit:
                farm.save()

            return farm

class NewSubscription(forms.ModelForm):
    class Meta:
        model = Subscription
        fields = [
            'name',
            'description',
            'minimum_duration',
            'subscription_cost',
        ]

        def save(self, commit=True):
            subscription = super(NewSubscription, self).save(commit=False)
            subscription.name = self.cleaned_data['name']
            subscription.description = self.cleaned_data['description']

            if commit:
                subscription.save()

            return subscription
