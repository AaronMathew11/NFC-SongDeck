// App.js
import './App.css';
import {
    Route,
    Routes
} from 'react-router-dom';
import Home from './pages/home';
import List from './pages/list';
import Recomendation from './pages/recomendation';
import BottomNav from './Components/bottomNav';
import PraiseSongs from './pages/praiseSongs';
import CoreWorship from './pages/coreWorship';
import GenerateMessage from './pages/generateMessage'
import TransitionalSongs from './pages/transitionalSongs';
import { useState } from 'react';
import Roster from './pages/roster';
import Songs from './pages/songs';

function App() {
    
    const [selectedVideos, setSelectedVideos] = useState([]);  // Store selected videos

    const addVideoToList = (video) => {
        setSelectedVideos((prevVideos) => [...prevVideos, video]);
        console.log(selectedVideos)
    };
    const removeVideoFromList = (videoId) => {
        setSelectedVideos((prevVideos) =>
            prevVideos.filter((video) => video.youtubeId !== videoId)
        );
    };
    return (

        <div className="App">
        <BottomNav />
            <Routes>
                <Route path="/"
                    element={<Home />}/>
                    <Route path="/PraiseSongs"
                    element={<PraiseSongs addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList}/>}  />
                <Route path="/list"
                    element={<List list={selectedVideos} removeVideoFromList={removeVideoFromList}/>} />
                <Route path="/recomend"
                    element={<Recomendation />} />
                   <Route path="/CoreWorship"
                    element={<CoreWorship addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList}/>} />
                     <Route path="/TransitionalSongs"
                    element={<TransitionalSongs addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList}/>} />
                <Route path="/message-generator"
                    element={<GenerateMessage selectedVideos={selectedVideos} />} />
                <Route path="/Roster"
                    element={<Roster />} />
                <Route path="/WeeklySongs"
                    element={<Songs />} />
            </Routes>
        </div>
    );
}

export default App;
