import React, { useState, useEffect } from 'react';
import { FaMusic, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaEye, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { draftService } from '../utils/draftService';
import { useAuth } from '../context/AuthContext';
import { canAccessWorshipHeadDashboard } from '../utils/permissions';

const WorshipHeadDashboard = () => {
  const { user } = useAuth();
  const [publishRequests, setPublishRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublishRequests();
  }, []);

  const loadPublishRequests = async () => {
    try {
      const requests = await draftService.getAllPublishRequests();
      console.log('Loaded publish requests:', requests);
      console.log('First request structure:', requests[0]);
      setPublishRequests(requests);
      setError(null);
    } catch (error) {
      console.error('Error loading publish requests:', error);
      if (error.response && error.response.status === 403) {
        setError('Access denied. Only authorized worship heads can view requests.');
      } else {
        setError('Error loading publish requests. Please try again.');
      }
      setPublishRequests([]);
    }
  };

  const handleApprove = async (requestId) => {
    console.log('handleApprove called with requestId:', requestId);
    if (window.confirm('Are you sure you want to approve this worship list?')) {
      try {
        await draftService.updatePublishRequestStatus(requestId, 'approved');
        await loadPublishRequests();
      } catch (error) {
        console.error('Error approving request:', error);
        alert('Error approving request. Please try again.');
      }
    }
  };

  const handleReject = async (requestId) => {
    console.log('handleReject called with requestId:', requestId);
    if (window.confirm('Are you sure you want to reject this worship list?')) {
      try {
        await draftService.updatePublishRequestStatus(requestId, 'rejected');
        await loadPublishRequests();
      } catch (error) {
        console.error('Error rejecting request:', error);
        alert('Error rejecting request. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const pendingRequests = publishRequests.filter(req => req.status === 'pending');
  const processedRequests = publishRequests.filter(req => req.status !== 'pending');

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">Worship Head Dashboard</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Review and manage worship list requests
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
            <div className="text-xs text-gray-600">Pending Requests</div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{processedRequests.length}</div>
            <div className="text-xs text-gray-600">Processed</div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Pending Requests</h2>
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-card p-6 text-center">
              <FaCheck className="text-3xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-xs">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900 mb-2">{request.title}</h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>{request.requestedByName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt />
                          <span>{request.worshipDate ? new Date(request.worshipDate).toLocaleDateString() : 'No date set'}</span>
                        </div>
                      </div>
                      {request.theme && (
                        <p className="text-xs text-gray-600 text-left">{request.theme}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowPreviewModal(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center ml-3"
                      title="Preview"
                    >
                      <FaEye className="text-xs" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {processedRequests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {processedRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-sm text-gray-900">{request.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>{request.requestedByName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt />
                          <span>{formatDate(request.reviewedAt || request.requestedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">Preview Request</h3>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedRequest(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">{selectedRequest.title}</h4>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Requested by: {selectedRequest.requestedByName}</div>
                  <div>Requested on: {formatDate(selectedRequest.requestedAt)}</div>
                  {selectedRequest.theme && <div>Theme: {selectedRequest.theme}</div>}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Song List ({selectedRequest.selectedVideos.length} songs):</h4>
                <div className="space-y-2">
                  {selectedRequest.selectedVideos.map((song, index) => (
                    <div key={song.youtubeId} className="bg-gray-50 rounded-lg p-3 text-xs">
                      <div className="font-medium text-gray-900">{index + 1}. {song.title}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        youtube.com/watch?v={song.youtubeId}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  handleReject(selectedRequest.id);
                  setShowPreviewModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedRequest.id);
                  setShowPreviewModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorshipHeadDashboard;