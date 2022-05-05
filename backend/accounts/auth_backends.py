from django.contrib.auth import backends
from accounts.models import User
from django.db.models import Q

class AuthenticationBackend(backends.ModelBackend):
    #Custom authentication Backend for login using email,phone,username 
    #with password
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username) | Q(phonenumber__iexact=username))
            
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            pass

        