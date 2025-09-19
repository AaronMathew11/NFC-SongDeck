const fs = require('fs');
const path = require('path');

function extractYouTubeData(textContent) {
    const results = [];
    const seenVideoIds = new Set();
    const lines = textContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for YouTube links
        const youtubeMatch = line.match(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            const fullLink = youtubeMatch[0];
            
            // Skip if we've already seen this video ID
            if (seenVideoIds.has(videoId)) {
                continue;
            }
            seenVideoIds.add(videoId);
            
            // Try to find song name in the same line or previous lines
            let songName = '';
            
            // Check if song name is in the same line before the URL
            const beforeUrl = line.substring(0, line.indexOf(fullLink)).trim();
            if (beforeUrl) {
                // Remove numbers, bullets, and dashes from the beginning
                songName = beforeUrl.replace(/^[\d\-\*\s\)\(\.]+/, '').trim();
            }
            
            // If no song name found in same line, check previous line
            if (!songName && i > 0) {
                const prevLine = lines[i - 1].trim();
                if (prevLine && !prevLine.includes('https://')) {
                    songName = prevLine.replace(/^[\d\-\*\s\)\(\.]+/, '').trim();
                }
            }
            
            // If still no song name, check if there's a number followed by text in the same line
            const numberedSong = line.match(/^\d+\s+(.+?)\s+https:/);
            if (numberedSong) {
                songName = numberedSong[1].trim();
            }
            
            // If still no song name, extract from context around the link
            if (!songName) {
                const words = beforeUrl.split(/\s+/).filter(word => 
                    word.length > 2 && 
                    !word.match(/^\d+$/) && 
                    !word.match(/^[\-\*\)\(\.]+$/)
                );
                songName = words.join(' ');
            }
            
            // Clean up song name
            songName = songName
                .replace(/^\*+|\*+$/g, '') // Remove asterisks from start/end
                .replace(/^-+|-+$/g, '')   // Remove dashes from start/end
                .replace(/^\.|\.$/g, '')   // Remove dots from start/end
                .replace(/^Song\s+\d+\s*-\s*/i, '') // Remove "Song X -" pattern
                .replace(/^\d+\.\s*/, '')  // Remove numbered list format
                .replace(/^\w+\s*[:-]\s*/, '') // Remove prefixes like "Song 1:", "1:", etc
                .replace(/\s*-\s*$/, '')   // Remove trailing dash
                .trim();
            
            results.push({
                songName: songName || 'Unknown Song',
                youtubeLink: fullLink,
                videoId: videoId
            });
        }
    }
    
    return results;
}

function saveResults(data, outputFile) {
    let output = 'Song Name,YouTube Link,Video ID\n';
    
    data.forEach((item) => {
        const songName = item.songName.replace(/"/g, '""'); // Escape quotes for CSV
        output += `"${songName}","${item.youtubeLink}","${item.videoId}"\n`;
    });
    
    fs.writeFileSync(outputFile, output, 'utf8');
    console.log(`Results saved to ${outputFile}`);
    console.log(`Found ${data.length} YouTube links`);
}

// Main execution
const inputFile = path.join(__dirname, 'textDump.txt');
const outputFile = path.join(__dirname, 'youtubeSongs.csv');

try {
    const textContent = fs.readFileSync(inputFile, 'utf8');
    const youtubeData = extractYouTubeData(textContent);
    saveResults(youtubeData, outputFile);
} catch (error) {
    console.error('Error processing file:', error.message);
}