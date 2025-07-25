from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta, datetime
from collections import defaultdict

from .models import User, Board, Feedback, Comment
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    BoardSerializer, FeedbackSerializer, CommentSerializer,
    FeedbackSummarySerializer
)
from .permissions import (
    IsAdminOrModerator, IsAdminOrReadOnly, IsBoardMemberOrPublic,
    CanEditFeedback, CanEditComment
)

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer


    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAdminOrReadOnly, IsBoardMemberOrPublic]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'moderator']:
            return Board.objects.all()
        else:
            return Board.objects.filter(
                Q(public=True) | Q(members=user)
            ).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, CanEditFeedback]

    def get_queryset(self):
        queryset = Feedback.objects.select_related('created_by', 'board').prefetch_related('upvotes', 'comments')

        # Filter by board access
        user = self.request.user
        if user.role not in ['admin', 'moderator']:
            queryset = queryset.filter(
                Q(board__public=True) | Q(board__members=user)
            ).distinct()

        # Apply filters
        board_id = self.request.query_params.get('board_id')
        status_filter = self.request.query_params.get('status')
        tags_filter = self.request.query_params.get('tags')
        search = self.request.query_params.get('search')
        ordering = self.request.query_params.get('ordering', '-created_at')

        if board_id:
            queryset = queryset.filter(board_id=board_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if tags_filter:
            queryset = queryset.filter(tags__icontains=tags_filter)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )

        # Handle ordering - CHANGE HERE: use different annotation name
        if ordering == 'upvotes':
            queryset = queryset.annotate(upvotes_count=Count('upvotes')).order_by('-upvotes_count')
        elif ordering == '-upvotes':
            queryset = queryset.annotate(upvotes_count=Count('upvotes')).order_by('upvotes_count')
        else:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        feedback = self.get_object()
        user = request.user

        if feedback.upvotes.filter(id=user.id).exists():
            feedback.upvotes.remove(user)
            upvoted = False
        else:
            feedback.upvotes.add(user)
            upvoted = True

        return Response({
            'upvoted': upvoted,
            'upvote_count': feedback.upvote_count
        })

    @action(detail=False, methods=['get'])
    def summary(self, request):
        days     = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start    = end_date - timedelta(days=days)

        # counts
        total  = Feedback.objects.count()
        open_  = Feedback.objects.filter(status='open').count()
        ip     = Feedback.objects.filter(status='in_progress').count()
        comp   = Feedback.objects.filter(status='completed').count()
        rej    = Feedback.objects.filter(status='rejected').count()

        # top‐voted QS (real model instances, not dicts)
        top_qs = (
          Feedback.objects
            .select_related('created_by','board')
            .annotate(upvotes_count=Count('upvotes'))
            .order_by('-upvotes_count')[:5]
        )

        # trends, distributions...
        trends = {}
        for i in range(days):
            d = start + timedelta(days=i)
            trends[d.strftime('%Y-%m-%d')] = Feedback.objects.filter(created_at__date=d).count()

        status_dist = {
          'open': open_, 'in_progress': ip,
          'completed': comp, 'rejected': rej
        }

        tag_dist = {}
        for fb in Feedback.objects.exclude(tags=''):
            for t in [t.strip() for t in fb.tags.split(',') if t.strip()]:
                tag_dist[t] = tag_dist.get(t,0) + 1

        payload = {
          'total_feedback': total,
          'open_feedback': open_,
          'in_progress_feedback': ip,
          'completed_feedback': comp,
          'rejected_feedback': rej,
          'top_voted_feedback': top_qs,
          'feedback_trends': trends,
          'status_distribution': status_dist,
          'tag_distribution': tag_dist,
        }

        # pass the dict as the “instance” to the Serializer
        serializer = FeedbackSummarySerializer(payload, context={'request': request})
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, CanEditComment]

    def get_queryset(self):
        feedback_id = self.request.query_params.get('feedback_id')
        if feedback_id:
            return Comment.objects.filter(feedback_id=feedback_id).select_related('user')
        return Comment.objects.all().select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
