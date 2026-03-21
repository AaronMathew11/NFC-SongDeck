import { publishRequestAPI } from './apiService';

const DRAFT_KEY = 'worshipListDrafts';

export const draftService = {
  saveDraft: (title, selectedVideos, theme = '', scripture = '', message = '', worshipDate = '', playlistName = '') => {
    const drafts = getDrafts();
    const newDraft = {
      id: Date.now().toString(),
      title,
      selectedVideos: [...selectedVideos],
      theme,
      scripture,
      message,
      worshipDate,
      playlistName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    drafts.push(newDraft);
    
    // Use user-specific key
    const userToken = localStorage.getItem('token');
    let userId = 'anonymous';
    
    if (userToken) {
      try {
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        userId = payload.userId;
      } catch (e) {
        console.warn('Could not decode token for user-specific drafts');
      }
    }
    
    const userSpecificKey = `${DRAFT_KEY}_${userId}`;
    localStorage.setItem(userSpecificKey, JSON.stringify(drafts));
    return newDraft;
  },

  getDrafts: () => {
    return getDrafts();
  },

  deleteDraft: (draftId) => {
    const drafts = getDrafts();
    const filteredDrafts = drafts.filter(draft => draft.id !== draftId);
    
    // Use user-specific key
    const userToken = localStorage.getItem('token');
    let userId = 'anonymous';
    
    if (userToken) {
      try {
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        userId = payload.userId;
      } catch (e) {
        console.warn('Could not decode token for user-specific drafts');
      }
    }
    
    const userSpecificKey = `${DRAFT_KEY}_${userId}`;
    localStorage.setItem(userSpecificKey, JSON.stringify(filteredDrafts));
    return filteredDrafts;
  },

  updateDraft: (draftId, updates) => {
    const drafts = getDrafts();
    const draftIndex = drafts.findIndex(draft => draft.id === draftId);
    
    if (draftIndex !== -1) {
      drafts[draftIndex] = {
        ...drafts[draftIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Use user-specific key
      const userToken = localStorage.getItem('token');
      let userId = 'anonymous';
      
      if (userToken) {
        try {
          const payload = JSON.parse(atob(userToken.split('.')[1]));
          userId = payload.userId;
        } catch (e) {
          console.warn('Could not decode token for user-specific drafts');
        }
      }
      
      const userSpecificKey = `${DRAFT_KEY}_${userId}`;
      localStorage.setItem(userSpecificKey, JSON.stringify(drafts));
      return drafts[draftIndex];
    }
    return null;
  },

  requestPublish: async (draft, finalMessage) => {
    try {
      const publishRequestData = {
        title: draft.title,
        draftId: draft.id,
        selectedVideos: draft.selectedVideos,
        theme: draft.theme,
        scripture: draft.scripture,
        finalMessage: finalMessage || draft.message,
        worshipDate: draft.worshipDate,
        playlistName: draft.playlistName,
      };
      
      console.log('publishRequestData being sent:', publishRequestData);
      console.log('selectedVideos in request:', publishRequestData.selectedVideos);
      
      const response = await publishRequestAPI.submitPublishRequest(publishRequestData);
      return response.data;
    } catch (error) {
      console.error('Error submitting publish request:', error);
      throw error;
    }
  },

  getPublishRequests: async () => {
    try {
      const response = await publishRequestAPI.getMyPublishRequests();
      return response.data;
    } catch (error) {
      console.error('Error fetching publish requests:', error);
      return [];
    }
  },

  getAllPublishRequests: async () => {
    try {
      const response = await publishRequestAPI.getAllPublishRequests();
      console.log('getAllPublishRequests API response:', response);
      console.log('getAllPublishRequests data:', response.data);
      
      // Ensure each request has an id field
      const requests = response.data || [];
      const processedRequests = requests.map(req => ({
        ...req,
        id: req.id || req._id || req.id // Fallback to _id if id is missing
      }));
      
      console.log('Processed requests with id:', processedRequests);
      return processedRequests;
    } catch (error) {
      console.error('Error fetching all publish requests:', error);
      return [];
    }
  },

  updatePublishRequestStatus: async (requestId, status) => {
    try {
      console.log('draftService - updatePublishRequestStatus called with:', { requestId, status });
      const response = await publishRequestAPI.updatePublishRequestStatus(requestId, status);
      return response.data;
    } catch (error) {
      console.error('Error updating publish request status:', error);
      throw error;
    }
  },

  getPendingRequestsCount: async () => {
    try {
      const response = await publishRequestAPI.getPendingRequestsCount();
      return response.data.count;
    } catch (error) {
      console.error('Error getting pending requests count:', error);
      return 0;
    }
  }
};

function getDrafts() {
  try {
    const userToken = localStorage.getItem('token');
    let userId = 'anonymous';
    
    if (userToken) {
      try {
        // Decode JWT token to get user ID (simple base64 decode)
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        userId = payload.userId;
      } catch (e) {
        console.warn('Could not decode token for user-specific drafts');
      }
    }
    
    const userSpecificKey = `${DRAFT_KEY}_${userId}`;
    const drafts = localStorage.getItem(userSpecificKey);
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
}

