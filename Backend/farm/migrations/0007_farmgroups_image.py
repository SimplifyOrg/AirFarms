# Generated by Django 3.2.12 on 2022-11-16 03:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('farm', '0006_alter_farm_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='farmgroups',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='farm_group_media'),
        ),
    ]