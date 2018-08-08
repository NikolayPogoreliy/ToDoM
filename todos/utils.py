from rest_framework import status
from rest_framework.response import Response
from .models import Project


class OwnerCreateUpdateMixin():
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        projects = [p.id for p in Project.objects.filter(owner=self.request.user)]
        if not int(self.request.data['project_id']) in projects:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        projects = [p.id for p in Project.objects.filter(owner=self.request.user)]
        if not int(self.request.data['project_id']) in projects:
            return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)