from django.contrib import admin
from .models import (
            Farm,
            FarmDiscussionBoard,
            Subscription,
            SubscriptionPicture,
            FarmPicture,
            FarmFollowers
            )

admin.site.register(Farm)
admin.site.register(FarmDiscussionBoard)
admin.site.register(Subscription)
admin.site.register(SubscriptionPicture)
admin.site.register(FarmPicture)
admin.site.register(FarmFollowers)
