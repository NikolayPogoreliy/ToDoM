from datetime import datetime, timedelta

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Project, Task
from .utils import OwnerCreateUpdateMixin
from .permissions import IsOwnerPermission
from .serializers import ProjectSerializer, TaskSerializer
# Create your views here.


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        proj_id = kwargs['pk']
        if not Task.objects.filter(project=proj_id, is_done=False).count():
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(data= r'You can`t delete project untill all tasks will be finished!!! ', status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(owner__username=user)
        return queryset


class TaskViewSet(OwnerCreateUpdateMixin, viewsets.ModelViewSet):
    permission_classes = (IsOwnerPermission, )
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        serializer.save(project=Project.objects.get(pk=self.request.data['project']))

    def perform_update(self, serializer):
        serializer.save(project=Project.objects.get(pk=self.request.data['project']))



    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(project__owner=user, is_done=False).select_related()
        return queryset

    @action(methods=['GET'], detail=False)
    def weekly(self, request):
        user = request.user
        week = datetime.today() + timedelta(days=7)
        weekly_tasks = Task.objects.filter(project__owner__username=user, is_done=False, deadline__date__lte=week).exclude(deadline__date=datetime.today())
        serializer = self.get_serializer(weekly_tasks, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def daily(self, request):
        user = request.user
        daily_tasks = Task.objects.filter(project__owner__username=user, is_done=False, deadline__date__lte=datetime.today())
        serializer = self.get_serializer(daily_tasks, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def burning(self, request):
        user = request.user
        burning_tasks = Task.objects.filter(project__owner__username=user, is_done=False, deadline__lt=datetime.now())
        serializer = self.get_serializer(burning_tasks, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def finished(self, request):
        user = request.user
        finished_tasks = Task.objects.filter(project__owner__username=user, is_done=True)
        serializer = self.get_serializer(finished_tasks, many=True)
        return Response(serializer.data)