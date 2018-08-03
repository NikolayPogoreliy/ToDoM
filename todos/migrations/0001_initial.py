# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-08-03 10:48
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Projects',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('color', models.CharField(default='#f00', max_length=9)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tasks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('priority', models.CharField(choices=[(0, {'color': '#f00', 'name': 'hi'}), (1, {'color': '#ff8a00', 'name': 'normal'}), (2, {'color': '#fff', 'name': 'low'})], max_length=20)),
                ('deadline', models.DateTimeField()),
                ('is_done', models.BooleanField(default=False)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='todos.Projects')),
            ],
            options={
                'ordering': ['-priority', 'deadline'],
            },
        ),
    ]
