import React, { useState, useEffect } from 'react';
import { FaDownload, FaEye, FaFolder } from 'react-icons/fa';

const SharedResources = () => {
  const [resources, setResources] = useState([]);

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

  const handlePreview = (resource) => {
    if (resource.type.includes('image') || resource.type.includes('pdf')) {
      window.open(resource.url, '_blank');
    } else {
      // For other file types, just download
      const link = document.createElement('a');
      link.href = resource.url;
      link.download = resource.name;
      link.click();
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">Shared Resources</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Access files and documents shared by the team
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Resources List */}
        <div className="mt-6 space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <FaFolder className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-xs mb-2">No shared resources yet</p>
                <p className="text-gray-400 text-xs">Files will appear here when admin uploads them</p>
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
                    {(resource.type.includes('image') || resource.type.includes('pdf')) && (
                      <button
                        onClick={() => handlePreview(resource)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
                        title="Preview"
                      >
                        <FaEye className="text-xs" />
                      </button>
                    )}
                    <a
                      href={resource.url}
                      download={resource.name}
                      className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors flex items-center justify-center"
                      title="Download"
                    >
                      <FaDownload className="text-xs" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedResources;