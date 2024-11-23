import { useState } from "react";
import React from "react";

function VideoList({ videos, title, addVideoToList,subtitle }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleIframes, setVisibleIframes] = useState({}); // Track iframe visibility
    const [clickedButtons, setClickedButtons] = useState({}); // Track clicked state for each button
    const [selectedDivs, setSelectedDivs] = useState({}); // Track selected state for each div
    const videosPerPage = 10;

    // Filter videos based on the search query
    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate indices of the current page's videos
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    const handleButtonClick = (video) => {
        addVideoToList(video);
        setClickedButtons((prevState) => ({
            ...prevState,
            [video.youtubeId]: true,
        }));
    };

    const toggleIframe = (youtubeId) => {
        setVisibleIframes((prevState) => ({
            ...prevState,
            [youtubeId]: !prevState[youtubeId], // Toggle visibility
        }));
        setSelectedDivs((prevState) => ({
            ...prevState,
            [youtubeId]: !prevState[youtubeId], // Toggle selected state
        }));
    };

    return (
        <div className="pb-24">
            <h1 className="text-xl font-bold  text-left ml-10 pt-10 truncate mb-2">{title}</h1>
            <p class="text-left  text-xs ml-10 mb-8">{subtitle}</p>

            <div className="mx-5">
                <input
                    type="text"
                    placeholder="Search Songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 p-2 rounded border-2 border-gray-300 w-full"
                />
            </div>

            <div>
                {currentVideos.map((video) => (
                    <div className="mx-2" key={video.youtubeId}>
                        <div
                            className={`flex-1 w-full mb-3 rounded-lg px-3 py-4 cursor-pointer shadow ${
                                selectedDivs[video.youtubeId] ? "bg-black" : "bg-white"
                            }`}
                            onClick={() => toggleIframe(video.youtubeId)} // Toggle iframe and selected state on click
                        >
                            {/* Conditionally render iframe */}
                            {visibleIframes[video.youtubeId] && (
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                    className="rounded-lg"
                                ></iframe>
                            )}
                            <div className="flex flex-row justify-between items-center mx-4 mt-4 mb-3">
                                <p
                                    className={`text-sm truncate w-60 text-left ${
                                        selectedDivs[video.youtubeId] ? "text-white" : "text-black"
                                    }`}
                                >
                                    {video.title}
                                </p>
                                <button
                                    className={`px-4 py-2 rounded-xl shadow ${
                                        selectedDivs[video.youtubeId]
                                            ? "bg-white text-black"
                                            : "bg-black text-white"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering iframe toggle
                                        handleButtonClick(video);
                                    }}
                                    disabled={clickedButtons[video.youtubeId]}
                                >
                                    {clickedButtons[video.youtubeId] ? (
                                        <p className="text-sm">Added</p>
                                    ) : (
                                        <p className="text-sm">Add to List</p>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 text-center">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-[#FFCB56] text-black rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-2 bg-[#FFCB56] text-black rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default VideoList;
