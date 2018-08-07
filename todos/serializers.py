from rest_framework import serializers

from django.contrib.auth.models import User
from .models import Project, Task


class BaseProjectSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Project
        fields = ['url', 'name', 'color']


class TaskSerializer(serializers.ModelSerializer):
    project = BaseProjectSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['url', 'title', 'priority', 'project', 'deadline', 'is_done']


class ProjectSerializer(BaseProjectSerializer):
    task = TaskSerializer(many=True, read_only=True)

    class Meta(BaseProjectSerializer.Meta):
        fields = ['task', 'id']+BaseProjectSerializer.Meta.fields
