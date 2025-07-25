import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { MessageSquare, Users, TrendingUp, CheckCircle, Plus, BarChart3, Folder } from 'lucide-react';
import { feedbackAPI } from '../api/feedback.js';
import { boardsAPI } from '../api/boards.js';
import toast from 'react-hot-toast';
import Loading from '../components/Common/Loading.jsx';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_feedback: 0,
    open_feedback: 0,
    completed_feedback: 0,
    recent_feedback: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await feedbackAPI.summary({ days: 7 });
      const recentFeedback = await feedbackAPI.list({ ordering: '-created_at', page_size: 5 });

      setStats({
        ...response.data,
        recent_feedback: recentFeedback.data.results || recentFeedback.data
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'board':
        navigate('/boards');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'analytics':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    {
      icon: MessageSquare,
      label: 'Total Feedback',
      value: stats.total_feedback || 0,
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Open Feedback',
      value: stats.open_feedback || 0,
      color: 'yellow'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.completed_feedback || 0,
      color: 'green'
    },
    {
      icon: Users,
      label: 'In Progress',
      value: stats.in_progress_feedback || 0,
      color: 'purple'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      completed: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your feedback today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${color}-100`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recent_feedback?.length > 0 ? (
              stats.recent_feedback.slice(0, 5).map((feedback) => (
                <div key={feedback.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 ${getStatusColor(feedback.status)} rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      New feedback: "{feedback.title.length > 40 ? feedback.title.substring(0, 40) + '...' : feedback.title}"
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>by {feedback.created_by?.username}</span>
                      <span>•</span>
                      <span>{feedback.board?.name}</span>
                      <span>•</span>
                      <span>{getTimeAgo(feedback.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {user?.role === 'admin' && (
              <button
                onClick={() => handleQuickAction('board')}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Folder className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-blue-900">Create New Board</div>
                    <div className="text-sm text-blue-700">Organize feedback by project or team</div>
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={() => handleQuickAction('feedback')}
              className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Plus className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-green-900">Submit Feedback</div>
                  <div className="text-sm text-green-700">Share your ideas and suggestions</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('analytics')}
              className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-purple-900">View Analytics</div>
                  <div className="text-sm text-purple-700">Check feedback trends and insights</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
