from rest_framework import permissions


class IsOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if (request.method in permissions.SAFE_METHODS) and request.user and request.user.is_authenticated():
            return True
        return obj.project.owner == request.user
