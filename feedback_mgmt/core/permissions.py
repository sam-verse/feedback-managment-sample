#!/usr/bin/env python3

from rest_framework import permissions

class IsAdminOrModerator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'moderator']

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'admin'

class IsBoardMemberOrPublic(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.public:
            return True
        return request.user.is_authenticated and (
            obj.members.filter(id=request.user.id).exists() or
            request.user.role in ['admin', 'moderator']
        )

class CanEditFeedback(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admins and moderators can edit any feedback
        if request.user.role in ['admin', 'moderator']:
            return True

        # Contributors can only edit their own feedback
        return obj.created_by == request.user

class CanEditComment(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admins and moderators can edit any comment
        if request.user.role in ['admin', 'moderator']:
            return True

        # Users can only edit their own comments
        return obj.user == request.user
