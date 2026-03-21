import React, { useState, useEffect } from 'react';
import { FaMusic, FaTrash, FaEdit, FaClock, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { draftService } from '../utils/draftService';

const DraftsPage = ({ loadDraftToList }) => {
  const [drafts, setDrafts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    const savedDrafts = draftService.getDrafts();
    
    try {
      // Get current publish requests to filter out submitted drafts
      const requests = await draftService.getPublishRequests();
      console.log('Loaded publish requests:', requests);
      
      const publishedDraftIds = requests.map(req => req.draftId);
      console.log('Published draft IDs:', publishedDraftIds);
      
      // Only show drafts that haven't been submitted for approval
      const availableDrafts = savedDrafts.filter(draft => {
        const isPublished = publishedDraftIds.includes(draft.id);
        console.log(`Draft "${draft.title}" (ID: ${draft.id}) - isPublished: ${isPublished}`);
        return !isPublished;
      });
      
      console.log('Available drafts after filtering:', availableDrafts);
      setDrafts(availableDrafts);
    } catch (error) {
      console.error('Error loading publish requests for filtering:', error);
      console.log('Falling back to show all drafts');
      // Fallback to showing all drafts if API call fails
      setDrafts(savedDrafts);
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      draftService.deleteDraft(draftId);
      await loadDrafts();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLoadDraft = (draft) => {
    if (loadDraftToList) {
      loadDraftToList(draft);
      navigate('/list');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">My Drafts</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Manage your saved worship list drafts
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Drafts Content */}
        <div className="mt-6 space-y-3">
          {drafts.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <FaMusic className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-xs mb-2">No drafts saved yet</p>
                <p className="text-gray-400 text-xs">Create your first worship list and save it as a draft</p>
              </div>
            </div>
          ) : (
            drafts.map((draft) => (
              <div key={draft.id} className="bg-white rounded-xl shadow-card p-4 animate-slide-up">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900 mb-1">{draft.title}</h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>{formatDate(draft.updatedAt)}</span>
                      </div>
                    </div>
                    {draft.theme && (
                      <p className="text-xs text-gray-600 text-left">{draft.theme}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleLoadDraft(draft)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center ml-3"
                    title="Preview"
                  >
                    <FaEye className="text-xs" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftsPage;