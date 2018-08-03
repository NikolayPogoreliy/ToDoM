from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Projects(models.Model):
    name = models.CharField(blank=False, max_length=200)
    color = models.CharField(default='#f00', max_length=9)
    owner = models.ForeignKey(to=User, related_name='projects')

    def __str__(self):
        return self.name


# class TaskPriority(models.Model):
#     pass
#
#
class Tasks(models.Model):
    PRIORITY = (
        ('0', {'name': 'hi', 'color': '#f00'}),
        ('1', {'name': 'normal', 'color': '#ff8a00'}),
        ('2', {'name': 'low', 'color': '#fff'})
    )
    title = models.CharField(blank=False, max_length=200)
    priority = models.CharField(blank=False, choices=PRIORITY, max_length=20)
    project = models.ForeignKey(to=Projects, related_name='tasks')
    deadline = models.DateTimeField(blank=False, null=False)
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return self.project.name + ': '+self.title

    class Meta:
        ordering = ['-priority', 'deadline']
