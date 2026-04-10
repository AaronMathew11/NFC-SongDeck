import React, { useState, useEffect } from 'react';
import { FaDownload, FaEye, FaFolder, FaTimes, FaExpand } from 'react-icons/fa';

const SharedResources = () => {
  const [resources, setResources] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/resources', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      } else {
        console.error('Failed to load resources:', response.statusText);
        setResources([]);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('image')) return '🖼️';
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('document') || mimeType?.includes('word')) return '📝';
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return '📊';
    if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) return '📽️';
    if (mimeType?.includes('audio')) return '🎵';
    if (mimeType?.includes('video')) return '🎥';
    return '📄';
  };

  const handlePreview = (resource) => {
    const downloadUrl = `https://api-m2ugc4x7ma-uc.a.run.app/api/resources/${resource._id}/download`;
    
    if (resource.mimeType?.includes('pdf')) {
      setSelectedPdf({
        ...resource,
        url: downloadUrl
      });
      setShowPdfViewer(true);
    } else if (resource.mimeType?.includes('image')) {
      window.open(downloadUrl, '_blank');
    } else {
      // For other file types, just download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resource.originalName;
      link.click();
    }
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
    setShowPdfViewer(false);
  };

  const openPdfInNewTab = () => {
    if (selectedPdf) {
      window.open(selectedPdf.url, '_blank');
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
          {loading ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto animate-spin mb-4"></div>
                <p className="text-gray-500 text-xs">Loading shared resources...</p>
              </div>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <FaFolder className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-xs mb-2">No shared resources yet</p>
                <p className="text-gray-400 text-xs">Files will appear here when admin uploads them</p>
              </div>
            </div>
          ) : (
            resources.map((resource) => (
              <div key={resource._id} className="bg-white rounded-xl shadow-card p-4 animate-slide-up">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getFileIcon(resource.mimeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{resource.originalName}</h3>
                      <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                        <span>{formatFileSize(resource.size)}</span>
                        <span>By {resource.uploadedByName}</span>
                        <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    {/* View/Preview button for images and PDFs */}
                    {(resource.mimeType?.includes('image') || resource.mimeType?.includes('pdf')) && (
                      <button
                        onClick={() => handlePreview(resource)}
                        className="w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors flex items-center justify-center"
                        title={resource.mimeType?.includes('pdf') ? 'View PDF' : 'Preview'}
                      >
                        <FaEye className="text-xs" />
                      </button>
                    )}
                    
                    {/* Download button - only show for non-PDF files */}
                    {!resource.mimeType?.includes('pdf') && (
                      <a
                        href={`https://api-m2ugc4x7ma-uc.a.run.app/api/resources/${resource._id}/download`}
                        download={resource.originalName}
                        className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors flex items-center justify-center"
                        title="Download"
                      >
                        <FaDownload className="text-xs" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-lg p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
              {selectedPdf.name}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={openPdfInNewTab}
                className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors flex items-center justify-center"
                title="Open in new tab"
              >
                <FaExpand className="text-sm" />
              </button>
              <button
                onClick={closePdfViewer}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
                title="Close"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 bg-gray-100">
            <iframe
              src={selectedPdf.url}
              className="w-full h-full"
              title={selectedPdf.name}
              frameBorder="0"
            >
              <p className="text-center p-8">
                Your browser does not support PDF viewing. 
                <button 
                  onClick={openPdfInNewTab}
                  className="text-blue-600 hover:underline ml-2"
                >
                  Click here to open in a new tab
                </button>
              </p>
            </iframe>
          </div>

          {/* Footer with file info */}
          <div className="bg-white border-t p-4">
            <div className="max-w-md mx-auto flex items-center justify-between text-sm text-gray-600">
              <span>📄 {selectedPdf.description || 'PDF Document'}</span>
              <span>Uploaded by {selectedPdf.uploadedByName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedResources;