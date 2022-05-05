# Generated by Django 3.2 on 2022-03-10 13:59

from django.db import migrations, models
import workflow.models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0004_alter_workflow_currentstate'),
    ]

    operations = [
        migrations.AddField(
            model_name='transitionapproval',
            name='approval',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='state',
            name='transition_date',
            field=models.DateTimeField(default=workflow.models.return_date_time),
        ),
    ]
