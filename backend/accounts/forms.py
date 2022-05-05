from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from phonenumber_field.formfields import PhoneNumberField


class SignUpForm(UserCreationForm):
    email = forms.EmailField()
    phone = PhoneNumberField(required=True)

    class Meta:
        model = get_user_model()
        fields = (
            'username',
            'first_name',
            'last_name',
            'email',
            'phone',
            'password1',
            'password2',
        )

        def save(self, commit=True):
            user = super(SignUpForm, self).save(commit=False)
            user.first_name = self.cleaned_data['first_name']
            user.last_name = self.cleaned_data['last_name']
            user.email = self.cleaned_data['email']
            user.phone = self.cleaned_data['phone']

            if commit:
                user.save()

            return user


class EditProfileForm(UserChangeForm):

    class Meta:
        model = get_user_model()
        fields = (
            'first_name',
            'last_name',
            'about',
            'email',
            'phonenumber',
            'birth_date',
            'password',
        )
