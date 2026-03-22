import React, { useState, useEffect } from 'react';
import { FaUpload, FaFile, FaTrash, FaDownload, FaTimes, FaEye, FaExpand } from 'react-icons/fa';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileDescription, setFileDescription] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

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
        // Fallback to localStorage
        const saved = localStorage.getItem('sharedResources');
        if (saved) {
          setResources(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('sharedResources');
      if (saved) {
        setResources(JSON.parse(saved));
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileDescription.trim()) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('description', fileDescription.trim());

      const response = await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        
        // Reload resources from server
        await loadResources();
        
        // Reset form
        setSelectedFile(null);
        setFileDescription('');
      } else {
        const error = await response.text();
        console.error('Upload failed:', error);
        alert('Upload failed: ' + error);
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`https://api-m2ugc4x7ma-uc.a.run.app/api/resources/${resourceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Reload resources from server
          await loadResources();
        } else {
          const error = await response.text();
          console.error('Delete failed:', error);
          alert('Delete failed: ' + error);
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource: ' + error.message);
      }
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
            <h1 className="text-lg font-bold text-white mb-2">Admin Resources</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Manage shared files and documents
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Upload Section */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Resource</h2>
            
            {/* Drag & Drop Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FaUpload className={`text-3xl mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-gray-600 mb-2">Drag and drop a file here, or click to select</p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="fileInput"
              />
              <label 
                htmlFor="fileInput"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getFileIcon(selectedFile.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFileDescription('');
                    }}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              </div>
            )}

            {/* Description Input */}
            {selectedFile && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder="Brief description of this resource..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="3"
                />
              </div>
            )}

            {/* Upload Button */}
            {selectedFile && (
              <div className="mt-4">
                <button
                  onClick={handleUpload}
                  disabled={!fileDescription.trim() || uploading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Upload Resource</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
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
                    
                    <button
                      onClick={() => handleDelete(resource._id)}
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

export default AdminResources;