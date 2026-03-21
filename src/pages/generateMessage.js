import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaSave, FaPaperPlane } from 'react-icons/fa';
import { draftService } from '../utils/draftService';

const MessageGeneratorPage = ({ selectedVideos }) => {
  const [theme, setTheme] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [message, setMessage] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const fetchBibleVerses = async () => {
    if (!book || !chapter || !verse) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book.toLowerCase()}/chapters/${chapter}/verses/${verse}.json`);
      const data = await response.json();
      setBibleVerse(data.text);
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      setBibleVerse('Could not fetch verse. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bibleVerse !== '') {
      generateMessage();
    }
  }, [bibleVerse, selectedVideos, theme, book, chapter, verse]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const generateMessage = () => {
    let generatedMessage = `Good Day Everyone! Please find the theme and worship list for this Sunday. Feel free to share your thoughts and suggestions for any changes.\n\n`;

    generatedMessage += `Worship Theme: ${theme}\n\n`;
    generatedMessage += `Scripture: ${book} ${chapter}:${verse}\n"${bibleVerse}"\n\n`;
    generatedMessage += `Song List:\n`;

    selectedVideos.forEach((song, index) => {
      generatedMessage += `${index + 1}. ${song.title}\n   https://www.youtube.com/watch?v=${song.youtubeId}\n\n`;
    });


    setMessage(generatedMessage);
  };

  const handleSaveDraft = () => {
    if (!draftTitle.trim()) {
      setSaveStatus('Please enter a title for your draft');
      return;
    }

    try {
      const scriptureRef = book && chapter && verse ? `${book} ${chapter}:${verse}` : '';
      draftService.saveDraft(
        draftTitle.trim(),
        selectedVideos,
        theme,
        scriptureRef
      );
      
      setSaveStatus('Draft saved successfully!');
      setShowSaveDialog(false);
      setDraftTitle('');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving draft');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleRequestPublish = async () => {
    if (!draftTitle.trim()) {
      setSaveStatus('Please enter a title for your list');
      return;
    }

    try {
      const scriptureRef = book && chapter && verse ? `${book} ${chapter}:${verse}` : '';
      console.log('selectedVideos before saveDraft:', selectedVideos); // Debug log
      const draft = draftService.saveDraft(
        draftTitle.trim(),
        selectedVideos,
        theme,
        scriptureRef
      );
      console.log('draft after saveDraft:', draft); // Debug log
      
      await draftService.requestPublish(draft, message);
      
      setSaveStatus('Publish request sent to worship head!');
      setShowPublishDialog(false);
      setDraftTitle('');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error sending publish request');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">Message Generator</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Create beautiful worship announcements
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
      {/* Form */}
      <div className="space-y-4 mb-6 pt-6 animate-slide-up">
        {/* Theme Input */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <h3 className="font-medium text-sm text-gray-900 mb-3">Worship Theme</h3>
          <input
            type="text"
            placeholder="Enter worship theme..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
          />
        </div>

        {/* Bible Verse Input */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <h3 className="font-medium text-sm text-gray-900 mb-3">Scripture Reference</h3>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Book"
              onChange={(e) => setBook(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
            />
            <input
              type="text"
              placeholder="Chapter"
              onChange={(e) => setChapter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
            />
            <input
              type="text"
              placeholder="Verse"
              onChange={(e) => setVerse(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button 
          onClick={fetchBibleVerses} 
          disabled={!theme || !book || !chapter || !verse || isLoading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            <span>Generate Message</span>
          )}
        </button>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div className={`mb-4 p-3 rounded-xl text-center text-sm ${
          saveStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        } animate-fade-in`}>
          {saveStatus}
        </div>
      )}

      {/* Generated Message */}
      {message && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm text-gray-900">Generated Message</h3>
              <button
                onClick={copyToClipboard}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                  isCopied 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {isCopied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <pre className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap break-words">
                {message}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaSave />
              <span>Save as Draft</span>
            </button>
            
            <button
              onClick={() => setShowPublishDialog(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaPaperPlane />
              <span>Request Publish</span>
            </button>
          </div>
        </div>
      )}

      {/* Save Draft Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Save as Draft</h3>
            <input
              type="text"
              placeholder="Enter draft title..."
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 mb-4"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setDraftTitle('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Request Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Request Publish</h3>
            <p className="text-gray-600 text-sm mb-4">This will send your list to the worship head for approval.</p>
            <input
              type="text"
              placeholder="Enter list title..."
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 mb-4"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPublishDialog(false);
                  setDraftTitle('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPublish}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MessageGeneratorPage;
