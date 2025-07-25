from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Board, Feedback, Comment

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'created_at')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('name', 'public', 'created_by', 'created_at')
    list_filter = ('public', 'created_at')
    filter_horizontal = ('members',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('title', 'board', 'status', 'created_by', 'upvote_count', 'created_at')
    list_filter = ('status', 'board', 'created_at')
    search_fields = ('title', 'description', 'tags')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'user', 'created_at')
    list_filter = ('created_at',)
