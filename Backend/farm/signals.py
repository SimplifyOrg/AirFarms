from django.db.models.signals import post_save
from .models import Farm, FarmPicture, FarmGroups
from account.models  import User
from django.dispatch import receiver

@receiver(post_save, sender=Farm)
def CreateFarmProfilePicture(sender, instance, created, **kwargs):
    if created:
        FarmPicture.objects.create(farm=instance)
        # Farm groups are created in the farm serializer
        # So in case some changes are needed in creation of 
        # farm groups please make changes there.
        # FarmSerializer is present in serializer.py in farm 
        # module.