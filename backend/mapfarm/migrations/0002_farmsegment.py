# Generated by Django 3.2 on 2021-06-01 06:22

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mapfarm', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FarmSegment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('segmentShape', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
                ('area', models.FloatField()),
                ('created', models.DateField(editable=False)),
                ('updated', models.DateTimeField(editable=False)),
                ('farmMap', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='farmMap', to='mapfarm.farmmap')),
            ],
        ),
    ]
