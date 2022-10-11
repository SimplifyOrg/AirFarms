from django.db.models.signals import post_save
from .models import User, ProfilePicture
from django.dispatch import receiver

@receiver(post_save, sender=User)
def CreateProfilePicture(sender, instance, created, **kwargs):
    if created:
        ProfilePicture.objects.create(user=instance)

@receiver(post_save, sender=User)
def SaveProfilePicture(sender, instance, **kwargs):
    instance.profilepicture.save()
