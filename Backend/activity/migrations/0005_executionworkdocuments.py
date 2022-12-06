# Generated by Django 3.2.12 on 2022-11-28 05:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0004_auto_20221127_2034'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExecutionWorkDocuments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='New file', max_length=256)),
                ('file', models.FileField(upload_to='files')),
                ('associatedExecutionWork', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.executionwork')),
            ],
        ),
    ]