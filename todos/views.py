from django.shortcuts import render

from rest_framework import serializers, viewsets

from django.contrib.auth.models import User
from .models import Projects, Tasks

# Create your views here.


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
