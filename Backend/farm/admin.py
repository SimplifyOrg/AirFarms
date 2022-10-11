from django.contrib import admin

# Register your models here.
from .models import (
            Farm,
            FarmDiscussionBoard,
            FarmGroups,
            FarmPicture
            )

admin.site.register(Farm)
admin.site.register(FarmDiscussionBoard)
admin.site.register(FarmPicture)
admin.site.register(FarmGroups)
