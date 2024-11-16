import { useState } from 'react';
import React from 'react';
import { FaPlus } from "react-icons/fa";


function VideoList({ videos, title, addVideoToList }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [buttonToggle, setButtonToggle] = useState(false)
    const videosPerPage = 10; // Number of videos per page

    // Filter videos based on the search query
    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate indices of the current page's videos
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    return (
        <div className="pb-20"> {/* Padding bottom to ensure space for pagination */}
        
            <h1 className="text-xl font-bold mb-4 text-left ml-5 pt-8 truncate">{title}</h1>
            <div class="mx-5">
            <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 p-2  rounded border-2 border-gray-300 w-full"
            />
            </div>

            <div>
                {currentVideos.map((video) => (
                    <div key={video.id} className="flex-1 w-full mb-3 rounded-lg px-3">
                        <iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy" // Lazy load the iframe
                        ></iframe>
                        <div className='flex flex-row justify-between items-center mx-5 mt-2'>
                        <p className="text-center text-sm font-semibold truncate">{video.title}</p>
                        <button
                            className=" px-4 py-2 bg-white text-black rounded"
                            onClick={() => addVideoToList(video)}  // Add video to list
                        >
                           <p class="text-sm">Add to List</p> 
                            {/* <FaPlus class="text-[16px] text-black"/> */}

                        </button>
                        </div>
          
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 text-center">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default VideoList;
