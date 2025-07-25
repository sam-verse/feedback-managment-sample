import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Calendar, User, GripVertical } from 'lucide-react';
import { feedbackAPI } from '../api/feedback.js';
import toast from 'react-hot-toast';
import Loading from '../components/Common/Loading.jsx';

const KanbanView = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: 'open', title: 'Open', color: 'blue' },
    { id: 'in_progress', title: 'In Progress', color: 'yellow' },
    { id: 'completed', title: 'Completed', color: 'green' },
    { id: 'rejected', title: 'Rejected', color: 'red' },
  ];

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await feedbackAPI.list();
      setFeedback(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setData('text/plain', item.id.toString());

    // Add visual feedback
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Only remove drag over state if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedItem || draggedItem.status === targetColumnId) {
      return;
    }

    try {
      await feedbackAPI.update(draggedItem.id, { status: targetColumnId });

      setFeedback(feedback.map(item =>
        item.id === draggedItem.id
          ? { ...item, status: targetColumnId }
          : item
      ));

      toast.success('Feedback status updated');
    } catch (error) {
      toast.error('Failed to update feedback status');
    }
  };

  const getColumnColor = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      green: 'border-green-200 bg-green-50',
      red: 'border-red-200 bg-red-50',
    };
    return colors[color] || 'border-gray-200 bg-gray-50';
  };

  const getHeaderColor = (color) => {
    const colors = {
      blue: 'text-blue-700 bg-blue-100',
      yellow: 'text-yellow-700 bg-yellow-100',
      green: 'text-green-700 bg-green-100',
      red: 'text-red-700 bg-red-100',
    };
    return colors[color] || 'text-gray-700 bg-gray-100';
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <p className="text-gray-600 mt-1">Drag and drop feedback to update their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnFeedback = feedback.filter(item => item.status === column.id);
          const isDragOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={`rounded-lg border-2 transition-all duration-200 ${getColumnColor(column.color)} ${
                isDragOver ? 'border-dashed border-4 bg-opacity-75 scale-105' : ''
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={`px-4 py-3 rounded-t-lg ${getHeaderColor(column.color)}`}>
                <h3 className="font-medium">
                  {column.title}
                  <span className="ml-2 text-sm">({columnFeedback.length})</span>
                </h3>
              </div>

              <div className={`p-4 min-h-[500px] ${isDragOver ? 'bg-opacity-50' : ''}`}>
                {columnFeedback.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 cursor-move transition-all duration-200 hover:shadow-md group ${
                      draggedItem?.id === item.id ? 'opacity-50 rotate-2 scale-105' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 flex-1">
                        {item.title}
                      </h4>
                      <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {item.description}
                    </p>

                    {item.tags_list && item.tags_list.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags_list.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags_list.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{item.tags_list.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {item.upvote_count}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {item.comment_count}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {item.created_by?.username}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {item.board?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

                {columnFeedback.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-sm">No feedback in {column.title.toLowerCase()}</div>
                    {isDragOver && (
                      <div className="mt-2 text-blue-500 font-medium">
                        Drop here to move feedback
                      </div>
                    )}
                  </div>
                )}

                {isDragOver && columnFeedback.length > 0 && (
                  <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50">
                    Drop here to move feedback
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual feedback when dragging */}
      {draggedItem && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none">
          Moving: {draggedItem.title.substring(0, 30)}...
        </div>
      )}
    </div>
  );
};

export default KanbanView;
