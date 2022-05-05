# Generated by Django 3.2 on 2022-02-06 15:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0014_auto_20211228_1838'),
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectDiscussionBoard',
            fields=[
                ('discussionboard_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.discussionboard')),
                ('project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            bases=('dashboard.discussionboard',),
        ),
    ]
