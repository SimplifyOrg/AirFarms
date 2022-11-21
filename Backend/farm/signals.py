from django.db.models.signals import post_save
from .models import Farm, FarmPicture
from django.dispatch import receiver

@receiver(post_save, sender=Farm)
def CreateFarmProfilePicture(sender, instance, created, **kwargs):
    if created:
        FarmPicture.objects.create(farm=instance)