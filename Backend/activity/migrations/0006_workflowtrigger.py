# Generated by Django 3.2.12 on 2022-12-01 07:58

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0005_executionworkdocuments'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkflowTrigger',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creationDate', models.DateTimeField(default=django.utils.timezone.now)),
                ('associatedState', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.state')),
                ('workflowToTrigger', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.workflow')),
            ],
        ),
    ]