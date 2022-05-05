from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

class PhoneOTP(models.Model):
    phonenumber = PhoneNumberField(blank=True, unique=True)
    otp = models.CharField(max_length = 4, blank = True, null = True)
    count = models.IntegerField(default = 0, help_text = 'Number of times OTP sent')
    validated = models.BooleanField(default=False, help_text = 'If true, users has validated with correct OTP')

    def __str__(self):
        return str(self.phone) + ' is sent ' + str(self.otp)

class User(AbstractUser):
    phonenumber = PhoneNumberField(blank=True, unique=True)
    about = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    USERNAME_FIELD = 'phonenumber'
    REQUIRED_FIELDS = ['username', 'email',]

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
