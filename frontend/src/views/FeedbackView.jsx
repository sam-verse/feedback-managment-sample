import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Heart, MessageCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { feedbackAPI } from '../api/feedback.js';
import { boardsAPI } from '../api/boards.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import Modal from '../components/Common/Modal.jsx';
import Loading from '../components/Common/Loading.jsx';
import CommentSection from '../components/Comment/CommentSection.jsx';

const FeedbackView = () => {
  const [feedback, setFeedback] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    board_id: '',
    status: '',
    ordering: '-created_at',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    board_id: '',
    tags: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [feedbackResponse, boardsResponse] = await Promise.all([
        feedbackAPI.list(filters),
        boardsAPI.list(),
      ]);
      setFeedback(feedbackResponse.data.results || feedbackResponse.data);
      setBoards(boardsResponse.data.results || boardsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackAPI.create(formData);
      toast.success('Feedback created successfully');
      setShowModal(false);
      setFormData({ title: '', description: '', board_id: '', tags: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create feedback');
    }
  };

  const handleUpvote = async (id) => {
    try {
      const response = await feedbackAPI.upvote(id);
      setFeedback(feedback.map(item =>
        item.id === id
          ? { ...item, is_upvoted: response.data.upvoted, upvote_count: response.data.upvote_count }
          : item
      ));
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleComments = (feedbackId) => {
    setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-happyfox-orange">Feedback</h1>
          <p className="text-happyfox-dark mt-1">Manage and track all feedback submissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-happyfox-orange text-white rounded-lg shadow hover:bg-happyfox-dark transition"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow border border-happyfox-orange p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-happyfox-orange" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
            />
          </div>

          <select
            value={filters.board_id}
            onChange={(e) => handleFilterChange('board_id', e.target.value)}
            className="px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
          >
            <option value="">All Boards</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.ordering}
            onChange={(e) => handleFilterChange('ordering', e.target.value)}
            className="px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
          >
            <option value="-created_at">Newest</option>
            <option value="created_at">Oldest</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow border border-happyfox-orange p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-happyfox-orange mb-2">
                  {item.title}
                </h3>
                <p className="text-happyfox-dark mb-3">{item.description}</p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-happyfox-dark/80">
                  <span className={`px-2 py-1 rounded-full font-medium border ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>Board: {item.board?.name}</span>
                  <span>By: {item.created_by?.username}</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags_list.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-happyfox-light text-happyfox-dark text-xs rounded-full border border-happyfox-orange"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpvote(item.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition-colors border ${
                    item.is_upvoted
                      ? 'bg-happyfox-orange text-white border-happyfox-orange hover:bg-happyfox-dark'
                      : 'bg-happyfox-light text-happyfox-dark border-happyfox-orange hover:bg-happyfox-orange/30'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${item.is_upvoted ? 'fill-current' : ''}`}
                  />
                  <span>{item.upvote_count}</span>
                </button>

                <button
                  onClick={() => toggleComments(item.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-happyfox-light text-happyfox-dark border border-happyfox-orange hover:bg-happyfox-orange/30 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{item.comment_count}</span>
                  {expandedFeedback === item.id ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  )}
                </button>
              </div>

              <div className="text-xs text-happyfox-dark/60">
                Updated {new Date(item.updated_at).toLocaleDateString()}
              </div>
            </div>

            {/* Comments Section */}
            {expandedFeedback === item.id && (
              <div className="mt-6 pt-6 border-t border-happyfox-orange">
                <CommentSection feedbackId={item.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Submit Feedback"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-happyfox-dark mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="Enter feedback title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-happyfox-dark mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="Enter feedback description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-happyfox-dark mb-1">
                Board
              </label>
              <select
                name="board_id"
                value={formData.board_id}
                onChange={(e) => setFormData({ ...formData, board_id: e.target.value })}
                className="w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                required
              >
                <option value="">Select board</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-happyfox-dark mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="e.g. bug, ui, feature"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 rounded-lg text-white font-semibold bg-happyfox-orange hover:bg-happyfox-dark transition"
          >
            Submit Feedback
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FeedbackView;
