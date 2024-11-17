import React, { useState, useEffect } from 'react';

const MessageGeneratorPage = ({ selectedVideos }) => {
  const [theme, setTheme] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [message, setMessage] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');

  
  // Fetch verses from an API
  const fetchBibleVerses = async (query) => {
    const response = await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book.toLowerCase()}/chapters/${chapter}/verses/${verse}.json`);
    const data = await response.json();
    setBibleVerse(data.text);  // Adjust based on actual API structure
  };

  useEffect(() => {
    if (bibleVerse!='') {
      generateMessage();  // Call generateMessage only when bibleVerse has data
    }
  }, [bibleVerse]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        alert('Message copied to clipboard!');
      });
    }
  };


  const generateMessage = () => {
    let generatedMessage = `Good Day Everyone. Please find the theme and worship list for this Sunday and feel free to share inputs for changes if required\n\n`;

    generatedMessage += `Theme - ${theme}\n\n`;
    generatedMessage += `${book} ${chapter}:${verse} ${bibleVerse}\n\n`;

    selectedVideos.forEach((song, index) => {
      generatedMessage += `Song ${index} - ${song.title} - https://www.youtube.com/watch?v=${song.youtubeId}\n`;
    });

    setMessage(generatedMessage);
  };

  return (
    <div className='bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full'>
      <h1 className='font-bold pt-10 pl-5 text-left text-xl '>Please help fill in </h1><h1 className='font-bold pl-5 text-left text-xl mb-10'> the following details</h1>
      <div className='mx-5'>
        <p className='text-left font-semibold mb-2'>Theme for worship</p>
        <input
          type="text"
          placeholder="Enter theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className='mx-5 mt-5'>
        <p className='text-left font-semibold mb-2'>Bible Verse</p>
        <div className='flex flex-row gap-2'>
        <input
          type="text"
          placeholder="Book"
          onChange={(e) => setBook(e.target.value)}
          className="border p-2 w-40"
        />
        <input
          type="text"
          placeholder="Chatpter"
          onChange={(e) => setChapter(e.target.value)}
          className="border p-2 w-20"
        />
                <input
          type="text"
          placeholder="Verse"
          onChange={(e) => setVerse(e.target.value)}
          className="border p-2 w-20"
        />
        </div>
      </div>
      <button onClick={fetchBibleVerses} className="mt-8 bg-blue-500 text-white p-3 rounded text-sm">
        Generate Message
      </button>

      {message && (
        <div className='mt-5'>
          <h2 className='ml-5 text-left font-semibold mb-5'>Generated Message:</h2>
          <div className='p-4 bg-white mx-5 rounded-xl'>
          <pre className='w-100% break-words overflow-x-hidden mx-5 text-sm text-left '>{message}</pre>
          </div>
          <button onClick={copyToClipboard} className="mt-8 bg-green-500 text-white p-3 rounded text-sm">
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageGeneratorPage;
