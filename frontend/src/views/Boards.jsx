import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Lock, Unlock, MessageSquare } from 'lucide-react';
import { boardsAPI } from '../api/boards';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/Common/Modal';
import Loading from '../components/Common/Loading';

const Boards = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    public: true,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.list();
      setBoards(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await boardsAPI.create(formData);
      toast.success('Board created successfully');
      setShowModal(false);
      setFormData({ name: '', description: '', public: true });
      fetchBoards();
    } catch (error) {
      toast.error('Failed to create board');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-happyfox-orange">Boards</h1>
          <p className="text-happyfox-dark mt-1">Organize your feedback by project or team</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-happyfox-orange text-white rounded-lg shadow hover:bg-happyfox-dark transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            className="bg-white rounded-xl shadow border border-happyfox-orange p-4 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-happyfox-orange mb-1">
                  {board.name}
                </h3>
                <p className="text-sm text-happyfox-dark">
                  {board.description || 'No description provided'}
                </p>
              </div>
              <div className="flex items-center ml-2">
                {board.public ? (
                  <Unlock className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-happyfox-dark/70">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{board.feedback_count || 0} feedback</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{board.members?.length || 0} members</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => navigate(`/feedback?board_id=${board.id}`)}
                className="w-full px-4 py-2 bg-happyfox-orange text-white rounded-lg shadow hover:bg-happyfox-dark transition"
              >
                View Board
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Board"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-happyfox-dark mb-1">
                Board Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="Enter board name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-happyfox-dark mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-happyfox-orange rounded-md focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="Enter board description"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="public"
                id="public"
                checked={formData.public}
                onChange={handleChange}
                className="h-4 w-4 text-happyfox-orange focus:ring-happyfox-orange border-happyfox-orange rounded"
              />
              <label htmlFor="public" className="ml-2 text-sm text-happyfox-dark">
                Make this board public
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 rounded-lg text-white font-semibold bg-happyfox-orange hover:bg-happyfox-dark transition"
          >
            Create Board
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Boards;
