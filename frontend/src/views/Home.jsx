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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-happyfox-orange">
            Welcome back, {user?.first_name || user?.username}!
          </h1>
          <p className="text-happyfox-dark mt-1">
            Here’s what’s happening with your feedback today.
          </p>
        </div>
        <img src="/happyfox-logo.png" alt="HappyFox Logo" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md mx-auto sm:mx-0 animate-fade-in" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-happyfox-light rounded-xl shadow border border-happyfox-orange p-4 flex items-center gap-4 transition hover:scale-105 hover:shadow-lg"
          >
            <div className="p-2 rounded-lg bg-happyfox-orange/20">
              <Icon className="h-6 w-6 text-happyfox-orange" />
            </div>
            <div>
              <p className="text-xs font-medium text-happyfox-dark">{label}</p>
              <p className="text-xl font-bold text-happyfox-orange">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow border border-happyfox-orange p-4">
          <h3 className="text-lg font-semibold text-happyfox-orange mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recent_feedback?.length > 0 ? (
              stats.recent_feedback.slice(0, 5).map((feedback) => (
                <div key={feedback.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 ${getStatusColor(feedback.status)} rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-happyfox-dark">
                      New feedback: "{feedback.title.length > 40 ? feedback.title.substring(0, 40) + '...' : feedback.title}"
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-happyfox-orange mt-1">
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
              <div className="text-center py-8 text-happyfox-dark/60">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-happyfox-orange/30" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border border-happyfox-orange p-4 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-happyfox-orange mb-4">Quick Actions</h3>
          <button
            onClick={() => handleQuickAction('board')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-happyfox-orange text-white font-semibold shadow hover:bg-happyfox-dark transition"
          >
            <Folder className="h-5 w-5" /> Go to Boards
          </button>
          <button
            onClick={() => handleQuickAction('feedback')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-happyfox-orange text-white font-semibold shadow hover:bg-happyfox-dark transition"
          >
            <MessageSquare className="h-5 w-5" /> View Feedback
          </button>
          <button
            onClick={() => handleQuickAction('analytics')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-happyfox-orange text-white font-semibold shadow hover:bg-happyfox-dark transition"
          >
            <BarChart3 className="h-5 w-5" /> View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
