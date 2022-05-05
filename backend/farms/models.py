from accounts.models import User
from djmoney.models.fields import MoneyField
from django.urls import reverse
from datetime import timedelta
from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator

from dashboard.models import DiscussionBoard

# Create your models here.

class Farm(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True,blank=True)
    date_created = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __unicode__(self):
        return self.name

    # def __str__(self):
    #     return self.name

    # def get_absolute_url(self):
    #     return reverse('farm-detail', kwargs={'pk': self.pk})

class FarmDiscussionBoard(DiscussionBoard):
    farm = models.OneToOneField(Farm, on_delete=models.CASCADE)

class FarmFollowers(models.Model):
    farm = models.OneToOneField(Farm, on_delete=models.CASCADE)
    follower = models.ForeignKey(User, related_name="follower", on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)

    def validate_unique(self, *args, **kwargs):
        super(FarmFollowers, self).validate_unique(*args, **kwargs)

        if self.__class__.objects.filter(follower=self.follower, farm=self.farm).exists():
            raise models.ValidationError(
                message='FarmFollowers with this (follower, farm) already exists.',
                code='unique_together',
                )

    def __str__(self):
        return f'{self.farm.name} FarmFollowers'

class FarmReview(models.Model):
    farm = models.ForeignKey(Farm, related_name='farm_review', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='farm_user', on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)
    comment_date = models.DateTimeField(default=timezone.now)
    rating = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    def __str__(self):
        return self.user.username

class Subscription(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True,blank=True)
    minimum_duration = models.DurationField(default=timedelta(days=30))
    date_created = models.DateTimeField(default=timezone.now)
    subscription_cost = MoneyField(
                                max_digits=14,
                                decimal_places=2,
                                default_currency='INR'
                            )
    farm = models.ForeignKey(
                            Farm,
                            related_name='farm',
                            on_delete=models.CASCADE
                            )
    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

class SubscriptionPicture(models.Model):
    subscription = models.ForeignKey(
                            Subscription,
                            related_name='subscription',
                            on_delete=models.CASCADE
                            )
    image = models.ImageField(default='default.jpg', upload_to='farm_media')
    description = models.TextField(null=True,blank=True)

    def __str__(self):
        return f'{self.subscription.name} SubscriptionPicture'

class FarmPicture(models.Model):
    farm = models.ForeignKey(
                            Farm,
                            on_delete=models.CASCADE
                            )
    image = models.ImageField(default='default.jpg', upload_to='farm_media')
    description = models.TextField(null=True,blank=True)
    profilePicture = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.farm.name} FarmPicture'
