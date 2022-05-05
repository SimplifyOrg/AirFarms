from django.contrib import admin
from .models import User, ProfilePicture

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

admin.site.register(ProfilePicture)
