# Generated by Django 3.2 on 2021-05-05 13:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('farms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='farm',
            name='date_created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='subscription',
            name='date_created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
