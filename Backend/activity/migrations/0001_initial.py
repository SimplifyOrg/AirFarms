# Generated by Django 3.2.12 on 2022-08-22 15:52

import activity.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('discussion', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('farm', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='New state', max_length=256)),
                ('notes', models.TextField(blank=True)),
                ('transition_date', models.DateTimeField(default=activity.models.return_date_time)),
                ('notifiers', models.ManyToManyField(blank=True, related_name='state_notifiers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('need_approval', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('has_finished', models.BooleanField(default=False)),
                ('is_production', models.BooleanField(default=False)),
                ('currentState', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='current_state', to='activity.state')),
                ('farm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='farm.farm')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Work',
            fields=[
                ('discussionboard_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='discussion.discussionboard')),
                ('notes', models.TextField(blank=True)),
                ('completion_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('start_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('has_finished', models.BooleanField(default=False)),
                ('is_halted', models.BooleanField(default=False)),
                ('assignee', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
                ('associatedState', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.state')),
                ('notifiers', models.ManyToManyField(blank=True, related_name='work_notifiers', to=settings.AUTH_USER_MODEL)),
            ],
            bases=('discussion.discussionboard',),
        ),
        migrations.CreateModel(
            name='TransitionApproval',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approval', models.BooleanField(default=False)),
                ('approver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('transitionToApprove', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.transition')),
            ],
        ),
        migrations.AddField(
            model_name='transition',
            name='associatedFlow',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.workflow'),
        ),
        migrations.AddField(
            model_name='transition',
            name='next',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='next_state', to='activity.state'),
        ),
        migrations.AddField(
            model_name='transition',
            name='previous',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='previous_state', to='activity.state'),
        ),
        migrations.CreateModel(
            name='JSONWorkflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jsonFlow', models.JSONField()),
                ('farm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='farm.farm')),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activity.workflow')),
            ],
        ),
    ]