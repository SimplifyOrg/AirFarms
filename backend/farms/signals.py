from django.db.models.signals import post_save
from .models import Farm, FarmProfilePicture, Subscription, SubscriptionPicture, FarmPicture
from django.dispatch import receiver

@receiver(post_save, sender=Farm)
def CreateFarmPicture(sender, instance, created, **kwargs):
    if created:
        FarmPicture.objects.create(farm=instance)

@receiver(post_save, sender=Farm)
def SaveFarmPicture(sender, instance, **kwargs):
    instance.farmpicture.save()

@receiver(post_save, sender=Farm)
def CreateFarmProfilePicture(sender, instance, created, **kwargs):
    if created:
        FarmProfilePicture.objects.create(farm=instance)

@receiver(post_save, sender=Farm)
def SaveFarmProfilePicture(sender, instance, **kwargs):
    instance.FarmProfilePicture.save()

@receiver(post_save, sender=Subscription)
def CreateSubscriptionPicture(sender, instance, created, **kwargs):
    if created:
        SubscriptionPicture.objects.create(subscription=instance)

@receiver(post_save, sender=Subscription)
def SaveFarmPicture(sender, instance, **kwargs):
    instance.subscriptionpicture.save()
