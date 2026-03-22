import React, { useState, useEffect } from 'react';
import { FaUpload, FaFile, FaTrash, FaDownload, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminResources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [fileDescription, setFileDescription] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = () => {
    // For now, load from localStorage, later replace with API call
    const saved = localStorage.getItem('sharedResources');
    if (saved) {
      setResources(JSON.parse(saved));
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileDescription.trim()) return;

    setUploading(true);
    
    try {
      // Simulate file upload - in real app, upload to server and get URL
      const fileUrl = URL.createObjectURL(selectedFile);
      
      const newResource = {
        id: Date.now().toString(),
        name: selectedFile.name,
        description: fileDescription.trim(),
        type: selectedFile.type,
        size: selectedFile.size,
        uploadedBy: user?.name || 'Admin',
        uploadedAt: new Date().toISOString(),
        url: fileUrl // In real app, this would be the server URL
      };

      const updatedResources = [...resources, newResource];
      setResources(updatedResources);
      localStorage.setItem('sharedResources', JSON.stringify(updatedResources));
      
      // Reset form
      setSelectedFile(null);
      setFileDescription('');
      setShowUploadDialog(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      const updatedResources = resources.filter(r => r.id !== resourceId);
      setResources(updatedResources);
      localStorage.setItem('sharedResources', JSON.stringify(updatedResources));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️';
    if (type.includes('audio')) return '🎵';
    if (type.includes('video')) return '🎥';
    return '📄';
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">Admin Resources</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Manage shared files and documents
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Upload Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowUploadDialog(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <FaPlus />
            <span>Upload New Resource</span>
          </button>
        </div>

        {/* Resources List */}
        <div className="mt-6 space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <FaFile className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-xs mb-2">No resources uploaded yet</p>
                <p className="text-gray-400 text-xs">Upload your first file to get started</p>
              </div>
            </div>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-card p-4 animate-slide-up">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getFileIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{resource.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                        <span>{formatFileSize(resource.size)}</span>
                        <span>By {resource.uploadedBy}</span>
                        <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <a
                      href={resource.url}
                      download={resource.name}
                      className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors flex items-center justify-center"
                      title="Download"
                    >
                      <FaDownload className="text-xs" />
                    </a>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors flex items-center justify-center"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">Upload Resource</h3>
              <button
                onClick={() => {
                  setShowUploadDialog(false);
                  setSelectedFile(null);
                  setFileDescription('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-600 mt-2">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder="Brief description of this resource..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowUploadDialog(false);
                    setSelectedFile(null);
                    setFileDescription('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !fileDescription.trim() || uploading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResources;