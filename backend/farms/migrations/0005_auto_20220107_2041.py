# Generated by Django 3.2 on 2022-01-07 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('farms', '0004_farmfollowers'),
    ]

    operations = [
        migrations.AddField(
            model_name='farmpicture',
            name='profilePicture',
            field=models.BooleanField(default=False),
        ),
        migrations.DeleteModel(
            name='FarmProfilePicture',
        ),
    ]
