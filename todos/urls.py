from django.conf.urls import url, include
from rest_framework import routers
from .views import ProjectViewSet, TaskViewSet


router = routers.DefaultRouter()
router.register('', ProjectViewSet, base_name='project')


urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^tasks/weekly/$', TaskViewSet.as_view({'get': 'weekly'}), name='task-weekly'),
    url(r'^tasks/daily/$', TaskViewSet.as_view({'get': 'daily'}), name='task-daily'),
    url(r'^tasks/burning/$', TaskViewSet.as_view({'get': 'burning'}), name='task-burning'),
    url(r'^tasks/finished/$', TaskViewSet.as_view({'get': 'finished'}), name='task-finished'),
    url(r'^tasks/$', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list'),
    url(r'^tasks/(?P<pk>[0-9]+)/$', TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy', 'patch': 'partial_update'}), name='task-detail'),
    url(r'', include(router.urls)),
]