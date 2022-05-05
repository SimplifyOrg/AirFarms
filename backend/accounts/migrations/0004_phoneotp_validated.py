# Generated by Django 3.2 on 2021-07-15 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_phoneotp'),
    ]

    operations = [
        migrations.AddField(
            model_name='phoneotp',
            name='validated',
            field=models.BooleanField(default=False, help_text='If true, users has validated with correct OTP'),
        ),
    ]
