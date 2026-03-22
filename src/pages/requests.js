import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCalendarAlt, FaCopy, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { draftService } from '../utils/draftService';

const RequestsPage = () => {
  const [publishRequests, setPublishRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    loadPublishRequests();
  }, []);

  const loadPublishRequests = async () => {
    try {
      const requests = await draftService.getPublishRequests();
      console.log('Successfully loaded publish requests for display:', requests);
      setPublishRequests(requests);
    } catch (error) {
      console.error('Error loading publish requests for display:', error);
      setPublishRequests([]);
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

  const copyMessageToClipboard = (message) => {
    if (navigator.clipboard && message) {
      navigator.clipboard.writeText(message).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const generateMessageFromRequest = (request) => {
    const formattedDate = request.worshipDate ? 
      new Date(request.worshipDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }) : 'this week';

    let message = `Hi Team,\nPlease find the worship set for ${formattedDate}:\n\n`;
    message += `Theme: ${request.theme || 'Not specified'}\n`;
    message += `Key verse: ${request.scripture || 'Not specified'}\n\n`;

    request.selectedVideos?.forEach((song, index) => {
      message += `${index + 1}- ${song.title}\n`;
    });

    if (request.youtubePlaylistUrl) {
      message += `\nPlaylist: ${request.youtubePlaylistUrl}`;
    } else if (request.playlistName) {
      message += `\nPlaylist: ${request.playlistName}`;
    }

    return message;
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">My Requests</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Track your worship list submissions and approvals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Publish Requests Content */}
        <div className="mt-6 space-y-3">
          {publishRequests.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <FaPaperPlane className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-xs mb-2">No publish requests yet</p>
                <p className="text-gray-400 text-xs">Submit your first worship list for approval</p>
              </div>
            </div>
          ) : (
            publishRequests.map((request) => (
              <div key={request.id}>
                <div className="bg-white rounded-xl shadow-card p-4 animate-slide-up">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-sm text-gray-900">{request.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                        <FaCalendarAlt />
                        <span>{request.worshipDate ? new Date(request.worshipDate).toLocaleDateString() : 'No date set'}</span>
                      </div>
                      {request.theme && (
                        <p className="text-xs text-gray-600 mb-1 text-left">Theme - {request.theme}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center ml-3"
                      title="View message"
                    >
                      <FaEye className="text-xs" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Overlay Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900">Generated Message</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyMessageToClipboard(generateMessageFromRequest(selectedRequest))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isCopied 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                  title="Copy message"
                >
                  {isCopied ? <FaCheck /> : <FaCopy />}
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
                  {generateMessageFromRequest(selectedRequest)}
                </pre>
              </div>
              
              {/* Request Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Songs:</span>
                    <span className="ml-2 text-gray-700">{selectedRequest.selectedVideos.length}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Submitted:</span>
                    <span className="ml-2 text-gray-700">{formatDate(selectedRequest.requestedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;