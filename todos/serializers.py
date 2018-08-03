from rest_framework import serializers

from django.contrib.auth.models import User
from .models import Projects, Tasks


class ProjectSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Projects
        fields = ['name', 'color']


class TaskSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model=Tasks
        fields = ['title', 'project', 'priority', 'deadline', 'is_done']