# Generated by Django 3.2.12 on 2022-11-08 16:04

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('farm', '0005_alter_farm_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='farm',
            unique_together={('id', 'user', 'name', 'archived')},
        ),
    ]