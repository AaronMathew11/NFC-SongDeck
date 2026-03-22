// App.js
import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import {
    Route,
    Routes,
    Navigate
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { canAccessWorshipHeadDashboard } from './utils/permissions';
import Home from './pages/home';
import List from './pages/list';
import SelectedSongs from './pages/selectedSongs';
import Recomendation from './pages/recomendation';
import Login from './pages/login';
import Roster from './pages/roster';
import Songs from './pages/songs';
import Drafts from './pages/drafts';
import Requests from './pages/requests';
import WorshipHeadDashboard from './pages/worshipHeadDashboard';
import Profile from './pages/profile';
import AdminResources from './pages/adminResources';
import SharedResources from './pages/sharedResources';
import BottomNav from './Components/bottomNav';
import PraiseSongs from './pages/praiseSongs';
import CoreWorship from './pages/coreWorship';
import TransitionalSongs from './pages/transitionalSongs';

const QuietTime = lazy(() => import('./pages/quietTime'));

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const WorshipHeadRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (!canAccessWorshipHeadDashboard(user)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [selectedVideos, setSelectedVideos] = useState([]);

    useEffect(() => {
        const savedSelectedVideos = localStorage.getItem('selectedVideos');
        if (savedSelectedVideos) {
            const parsed = JSON.parse(savedSelectedVideos);
            const uniqueVideos = parsed.filter((video, index, self) => 
                index === self.findIndex(v => v.youtubeId === video.youtubeId)
            );
            setSelectedVideos(uniqueVideos);
            if (uniqueVideos.length !== parsed.length) {
                localStorage.setItem('selectedVideos', JSON.stringify(uniqueVideos));
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedVideos', JSON.stringify(selectedVideos));
    }, [selectedVideos]);

    const addVideoToList = (video) => {
        console.log('Adding video to list:', video); // Debug log
        setSelectedVideos((prevVideos) => {
            const videoId = video.id || video.youtubeId;
            const isAlreadySelected = prevVideos.some(v => (v.id || v.youtubeId) === videoId);
            
            if (isAlreadySelected) {
                return prevVideos.filter(v => (v.id || v.youtubeId) !== videoId);
            } else {
                const newList = [...prevVideos, video];
                console.log('New selected videos list:', newList); // Debug log
                return newList;
            }
        });
    };
    
    const removeVideoFromList = (videoId) => {
        setSelectedVideos((prevVideos) =>
            prevVideos.filter((video) => (video.id || video.youtubeId) !== videoId)
        );
    };

    const reorderSongs = (newList) => {
        setSelectedVideos(newList);
    };

    const loadDraftToList = (draft) => {
        setSelectedVideos(draft.selectedVideos);
    };

    return (
        <div className="App">
            {isAuthenticated && <BottomNav />}
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                
                <Route path="/PraiseSongs" element={
                    <ProtectedRoute>
                        <PraiseSongs addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} selectedVideos={selectedVideos}/>
                    </ProtectedRoute>
                } />
                
                <Route path="/list" element={
                    <ProtectedRoute>
                        <List list={selectedVideos} addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} reorderSongs={reorderSongs}/>
                    </ProtectedRoute>
                } />

                <Route path="/selected-songs" element={
                    <ProtectedRoute>
                        <SelectedSongs list={selectedVideos} removeVideoFromList={removeVideoFromList} reorderSongs={reorderSongs} addVideoToList={addVideoToList}/>
                    </ProtectedRoute>
                } />
                
                <Route path="/recomend" element={
                    <ProtectedRoute>
                        <Recomendation />
                    </ProtectedRoute>
                } />
                
                <Route path="/CoreWorship" element={
                    <ProtectedRoute>
                        <CoreWorship addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} selectedVideos={selectedVideos}/>
                    </ProtectedRoute>
                } />
                
                <Route path="/TransitionalSongs" element={
                    <ProtectedRoute>
                        <TransitionalSongs addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} selectedVideos={selectedVideos}/>
                    </ProtectedRoute>
                } />
                
                
                <Route path="/Roster" element={
                    <ProtectedRoute>
                        <Roster />
                    </ProtectedRoute>
                } />
                
                <Route path="/WeeklySongs" element={
                    <ProtectedRoute>
                        <Songs />
                    </ProtectedRoute>
                } />
                
                <Route path="/quiet-time" element={
                    <ProtectedRoute>
                        <Suspense fallback={
                            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-gray-600 text-sm">Loading Quiet Time...</p>
                                </div>
                            </div>
                        }>
                            <QuietTime />
                        </Suspense>
                    </ProtectedRoute>
                } />
                
                <Route path="/drafts" element={
                    <ProtectedRoute>
                        <Drafts loadDraftToList={loadDraftToList} />
                    </ProtectedRoute>
                } />
                
                <Route path="/requests" element={
                    <ProtectedRoute>
                        <Requests />
                    </ProtectedRoute>
                } />
                
                <Route path="/worship-head" element={
                    <WorshipHeadRoute>
                        <WorshipHeadDashboard />
                    </WorshipHeadRoute>
                } />
                
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                
                <Route path="/admin-resources" element={
                    <WorshipHeadRoute>
                        <AdminResources />
                    </WorshipHeadRoute>
                } />
                
                <Route path="/shared-resources" element={
                    <ProtectedRoute>
                        <SharedResources />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_NOT_SET"}>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
