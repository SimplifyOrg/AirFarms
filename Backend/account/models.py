from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    phonenumber = PhoneNumberField(blank=True, unique=True)
    about = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    #USERNAME_FIELD = 'phonenumber'
    REQUIRED_FIELDS = ['phonenumber', 'email',]

    def __str__(self):
        return str(self.phonenumber)

    def get_full_name(self) -> str:
        if super().get_full_name():
            return super().get_full_name()
        else:
            return self.phonenumber

class ProfilePicture(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')

    def __str__(self):
        return f'{self.user.username} ProfilePicture'
