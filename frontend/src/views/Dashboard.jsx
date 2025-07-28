import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { feedbackAPI } from '../api/feedback';
import toast from 'react-hot-toast';
import Loading from '../components/Common/Loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  const fetchSummary = async () => {
    try {
      const response = await feedbackAPI.summary({ days: dateRange });
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const stats = [
    {
      icon: MessageSquare,
      label: 'Total Feedback',
      value: summary?.total_feedback || 0,
      color: 'blue',
    },
    {
      icon: Clock,
      label: 'Open',
      value: summary?.open_feedback || 0,
      color: 'blue',
    },
    {
      icon: TrendingUp,
      label: 'In Progress',
      value: summary?.in_progress_feedback || 0,
      color: 'yellow',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: summary?.completed_feedback || 0,
      color: 'green',
    },
  ];

  // Trend Chart Data
  const trendData = {
    labels: Object.keys(summary?.feedback_trends || {}),
    datasets: [
      {
        label: 'Feedback Submissions',
        data: Object.values(summary?.feedback_trends || {}),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Status Distribution Data
  const statusData = {
    labels: ['Open', 'In Progress', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [
          summary?.status_distribution?.open || 0,
          summary?.status_distribution?.in_progress || 0,
          summary?.status_distribution?.completed || 0,
          summary?.status_distribution?.rejected || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Tag Distribution Data (Top 10)
  const tagEntries = Object.entries(summary?.tag_distribution || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const tagData = {
    labels: tagEntries.map(([tag]) => tag),
    datasets: [
      {
        label: 'Feedback Count',
        data: tagEntries.map(([, count]) => count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-happyfox-orange">Dashboard</h1>
          <p className="text-happyfox-dark mt-1">Analytics and insights for your feedback</p>
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(Number(e.target.value))}
          className="px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow border border-happyfox-orange p-4">
          <h3 className="text-lg font-semibold text-happyfox-orange mb-4">
            Feedback Submission Trends
          </h3>
          <Line data={trendData} options={chartOptions} />
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow border border-happyfox-orange p-4">
          <h3 className="text-lg font-semibold text-happyfox-orange mb-4">
            Status Distribution
          </h3>
          <Pie data={statusData} options={pieOptions} />
        </div>
      </div>

      {/* Tag Distribution */}
      <div className="bg-white rounded-xl shadow border border-happyfox-orange p-4">
        <h3 className="text-lg font-semibold text-happyfox-orange mb-4">
          Popular Tags
        </h3>
        <Bar data={tagData} options={chartOptions} />
      </div>

      {/* Top Voted Feedback */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Voted Feedback
        </h3>
        <div className="space-y-4">
          {summary?.top_voted_feedback?.slice(0, 5).map((feedback, index) => (
            <div
              key={feedback.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{feedback.title}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span>Board: {feedback.board?.name}</span>
                  <span>By: {feedback.created_by?.username}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    feedback.status === 'completed' ? 'bg-green-100 text-green-800' :
                    feedback.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {feedback.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {feedback.upvote_count}
                </span>
                <span className="text-gray-500">upvotes</span>
              </div>
            </div>
          ))}

          {(!summary?.top_voted_feedback || summary.top_voted_feedback.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No feedback data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
