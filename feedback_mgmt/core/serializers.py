#!/usr/bin/env python3

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Board, Feedback, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        return attrs

class BoardSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    feedback_count = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ['id', 'name', 'description', 'public', 'created_by', 'members',
                 'member_ids', 'feedback_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_feedback_count(self, obj):
        return obj.feedback.count()

    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', [])
        board = Board.objects.create(**validated_data)
        if member_ids:
            board.members.set(User.objects.filter(id__in=member_ids))
        return board

    def update(self, instance, validated_data):
        member_ids = validated_data.pop('member_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if member_ids is not None:
            instance.members.set(User.objects.filter(id__in=member_ids))
        return instance

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    feedback_id = serializers.IntegerField(write_only=True)  # Accept feedback_id

    class Meta:
        model = Comment
        fields = ['id', 'user', 'feedback_id', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Convert feedback_id to feedback instance
        feedback_id = validated_data.pop('feedback_id')
        try:
            feedback = Feedback.objects.get(id=feedback_id)
            validated_data['feedback'] = feedback
        except Feedback.DoesNotExist:
            raise serializers.ValidationError("Feedback not found")

        return super().create(validated_data)

class FeedbackSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    board = BoardSerializer(read_only=True)
    board_id = serializers.IntegerField(write_only=True)
    upvote_count = serializers.SerializerMethodField()  # CHANGE: from ReadOnlyField to SerializerMethodField
    comment_count = serializers.ReadOnlyField()
    comments = CommentSerializer(many=True, read_only=True)
    is_upvoted = serializers.SerializerMethodField()
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ['id', 'title', 'description', 'board', 'board_id', 'status', 'tags',
                 'tags_list', 'created_by', 'upvote_count', 'comment_count', 'comments',
                 'is_upvoted', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_upvote_count(self, obj):
        # Check if it's annotated first, then fall back to property
        return getattr(obj, 'upvotes_count', obj.upvote_count)

    def get_is_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False

    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',') if tag.strip()]
        return []

class FeedbackSummarySerializer(serializers.Serializer):
    total_feedback    = serializers.IntegerField()
    open_feedback     = serializers.IntegerField()
    in_progress_feedback = serializers.IntegerField()
    completed_feedback   = serializers.IntegerField()
    rejected_feedback    = serializers.IntegerField()
    top_voted_feedback   = FeedbackSerializer(many=True, read_only=True)   # <-- add read_only
    feedback_trends      = serializers.DictField()
    status_distribution  = serializers.DictField()
    tag_distribution     = serializers.DictField()
