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
    { id: 'open', title: 'Open', color: 'orange' },
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
    switch (color) {
      case 'orange':
        return 'bg-happyfox-light border-happyfox-orange';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-400';
      case 'green':
        return 'bg-green-50 border-green-400';
      case 'red':
        return 'bg-red-50 border-red-400';
      default:
        return 'bg-happyfox-light border-happyfox-orange';
    }
  };
  const getHeaderColor = (color) => {
    switch (color) {
      case 'orange':
        return 'bg-happyfox-orange text-white';
      case 'yellow':
        return 'bg-yellow-400 text-white';
      case 'green':
        return 'bg-green-400 text-white';
      case 'red':
        return 'bg-red-400 text-white';
      default:
        return 'bg-happyfox-orange text-white';
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-happyfox-orange">Kanban Board</h1>
        <p className="text-happyfox-dark mt-1">Drag and drop feedback to update their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnFeedback = feedback.filter(item => item.status === column.id);
          const isDragOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={`rounded-xl border-2 transition-all duration-400 ease-smooth transform ${getColumnColor(column.color)} ${
                isDragOver ? 'border-dashed border-4 bg-opacity-75 scale-105 shadow-lg' : ''
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={`px-4 py-3 rounded-t-xl ${getHeaderColor(column.color)}`}>
                <h3 className="font-medium">
                  {column.title}
                  <span className="ml-2 text-sm">({columnFeedback.length})</span>
                </h3>
              </div>

              <div className={`p-4 min-h-[300px] ${isDragOver ? 'bg-opacity-50' : ''}`}> {/* reduced min height for mobile */}
                {columnFeedback.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-xl shadow border border-happyfox-orange p-4 mb-4 cursor-move transition-all duration-400 ease-smooth hover:shadow-lg hover:scale-[1.02] group ${
                      draggedItem?.id === item.id ? 'opacity-50 scale-105 shadow-xl' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-happyfox-orange mb-2 line-clamp-2 flex-1">
                        {item.title}
                      </h4>
                      <GripVertical className="h-4 w-4 text-happyfox-dark opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                    </div>

                    <p className="text-sm text-happyfox-dark mb-3 line-clamp-3">
                      {item.description}
                    </p>

                    {item.tags_list && item.tags_list.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags_list.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-happyfox-light text-happyfox-dark text-xs rounded-full border border-happyfox-orange"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags_list.length > 2 && (
                          <span className="px-2 py-1 bg-happyfox-light text-happyfox-dark text-xs rounded-full border border-happyfox-orange">
                            +{item.tags_list.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isDragOver && columnFeedback.length > 0 && (
                  <div className="border-2 border-dashed border-happyfox-orange rounded-xl p-4 text-center text-happyfox-orange bg-happyfox-light transition-all duration-400 ease-smooth animate-fade-in transform hover:bg-happyfox-orange/10">
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
        <div className="fixed top-4 right-4 bg-happyfox-orange text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none animate-fade-in transition-all duration-400 ease-smooth transform">
          Moving: {draggedItem.title.substring(0, 30)}...
        </div>
      )}
    </div>
  );
};

export default KanbanView;
