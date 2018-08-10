from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Project(models.Model):
    name = models.CharField(blank=False, max_length=200)
    color = models.CharField(default='#f00', max_length=9)
    owner = models.ForeignKey(to=User, related_name='project')

    def __str__(self):
        return self.name


class Task(models.Model):

    title = models.CharField(blank=False, max_length=200)
    priority = models.CharField(blank=False, max_length=20)
    project = models.ForeignKey(to=Project, related_name='task')
    deadline = models.DateTimeField(blank=False, null=False)
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return self.project.name + ': '+self.title

    class Meta:
        ordering = ['priority', 'deadline']
