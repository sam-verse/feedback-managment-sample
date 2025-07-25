import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2, Edit2 } from 'lucide-react';
import { commentsAPI } from '../../api/comments.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const CommentSection = ({ feedbackId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (feedbackId) {
      fetchComments();
    }
  }, [feedbackId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.list({ feedback_id: feedbackId });
      setComments(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      // Change 'feedback' to 'feedback_id' to match the backend expectation
      const response = await commentsAPI.create({
        feedback_id: feedbackId,  // Changed from 'feedback' to 'feedback_id'
        text: newComment.trim()
      });
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleEdit = async (commentId, newText) => {
    try {
      const response = await commentsAPI.update(commentId, { text: newText });
      setComments(comments.map(comment =>
        comment.id === commentId ? response.data : comment
      ));
      setEditingComment(null);
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const canEditComment = (comment) => {
    return user?.role === 'admin' || user?.role === 'moderator' || comment.user.id === user?.id;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <MessageCircle className="h-5 w-5 mr-2" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">{comment.user.username}</span>
                <span>•</span>
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>

              {canEditComment(comment) && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingComment(comment.id)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {editingComment === comment.id ? (
              <EditCommentForm
                comment={comment}
                onSave={handleEdit}
                onCancel={() => setEditingComment(null)}
              />
            ) : (
              <p className="mt-2 text-gray-900">{comment.text}</p>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EditCommentForm = ({ comment, onSave, onCancel }) => {
  const [text, setText] = useState(comment.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(comment.id, text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CommentSection;
