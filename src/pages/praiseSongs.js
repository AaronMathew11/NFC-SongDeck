import React from 'react';
import { useState } from 'react';
import VideoList from '../Components/videoList';

const PraiseSongs = ({addVideoToList, removeVideoFromList}) => {
  
  const praiseSongs = 
    [
      { title: 'Aaj Ka Yeh Din', youtubeId: 'X7NPwFVgZSY' },
      { title: 'All Things Are Possible', youtubeId: 'EqYBXFYYsxc' },
      { title: 'Be Bold, Be Strong', youtubeId: 'x9Bgxzk_P8w' },
      { title: 'The Name of the Lord', youtubeId: 'bYrcrP1ysjw' },
      { title: 'Build Your Kingdom Here', youtubeId: 'r-4bEbk1m_c' },
      { title: 'Chillakar Gaoonga', youtubeId: 'W7IqTmN11Gw' },
      { title: 'Dancing Generation', youtubeId: '6P2A1VUZYss' },
      { title: 'Everything That Has Breath', youtubeId: 'Iq_Q9Y6zDWs' },
      { title: 'Fear Not for I Am with You', youtubeId: 'FwWPL8iPB64' },
      { title: 'Flames', youtubeId: 'ad__P5ar8G8' },
      {
        title: 'Forever (Give Thanks to the Lord)',
        youtubeId: 'vziQffpVZ24'
      },
      { title: 'Glorious Day', youtubeId: 'LfzpfqrPUDo' },
      { title: 'God is Great', youtubeId: '2SHhpBVuxl0' },
      { title: 'Happy Day', youtubeId: 'vlWPGWfIvwU' },
      { title: 'I Am Free', youtubeId: 'pbO4D9cRFCo' },
      { title: 'I Believe', youtubeId: '1USWVZjTRw8' },
      { title: 'I Belong to Jesus', youtubeId: 'igbTZxbUc5o' },
      { title: "It's All About You", youtubeId: 'ArLrkBgrhmw' },
      { title: 'Jalali Yesu', youtubeId: 'dRcxL_4R7P8' },
      { title: 'Jashn Manaoonga', youtubeId: 'E6NHXIPBLqI' },
      {
        title: 'King of Glory - Your Face Outshines',
        youtubeId: '1Y-TYA7DefI'
      },
      { title: 'King of Heaven', youtubeId: 'VO76W9Zw0cs' },
      {
        title: 'King of My Heart, King of My Soul',
        youtubeId: 'NnH812oh7I0'
      },
      { title: 'You Are Good', youtubeId: 'Qk6Py5RW2AY' },
      { title: 'Majesty', youtubeId: 'vNjH8QDpBFY' },
      { title: 'My God', youtubeId: '89OPH53Ad0Y' },
      { title: 'My Lighthouse', youtubeId: 'reAlJKv7ptU' },
      { title: 'My Redeemer Lives', youtubeId: '3glYEDzSyok' },
      { title: 'One Way', youtubeId: 'yAJnHGoo44E' },
      { title: 'Praise Adonai', youtubeId: 'XpF7xpd-E-E' },
      { title: 'Praise is Raising', youtubeId: '_6t53HBih1I' },
      { title: 'Rock of Ages', youtubeId: '8_gD5pVhS3k' },
      {
        title: 'Senao Ka Yahova Hamare Sang Sang Hai',
        youtubeId: 'Z4x2pkdbwOc'
      },
      {
        title: 'Shout of the King (I Give You Praise)',
        youtubeId: '-qfJ7qBz_co'
      },
      { title: 'Shouts of Joy and Victory', youtubeId: 'DUOAUwT2lgE' },
      { title: 'Sing and Shout', youtubeId: 'Sw8lQ6dggGQ' },
      { title: 'Take it All', youtubeId: '0cYZOo04oUA' },
      { title: 'Tera Anugrah Kaafi Hai', youtubeId: 'gvGrK7K5w0Y' },
      { title: 'The Lord Reigns', youtubeId: 'xfVZpx3zBgA' },
      { title: 'The Walls Will Come Down', youtubeId: 'PaCThULi2rU' },
      { title: 'This is Amazing Grace', youtubeId: 'XFRjr_x-yxU' },
      {
        title: 'This Is How We Overcome (You Have Turned My Morning Into Dancing)',
        youtubeId: 'JdCg8oqMlrQ'
      },
      { title: 'Today is the Day', youtubeId: 'mGVbFiqAXhY' },
      { title: 'Victorious God', youtubeId: 'ODWo5VdBlhM' },
      {
        title: 'Walk Walk Walk Walk in the Light',
        youtubeId: 'JTIw5wddnjg'
      },
      { title: 'Who is Like the Lord', youtubeId: 'gk6GASkBEUQ' },
      { title: 'Yeshu Hai Sacha Gadariya', youtubeId: 'KwHzHS1wy2I' },
      { title: 'Yeshu Vijayi Hai', youtubeId: '-KVeUtI0OEg' },
      { title: 'Yeshua is Lord', youtubeId: '4slU_JjdhrU' },
      { title: 'You Are Good', youtubeId: 'Qk6Py5RW2AY' },
      { title: 'Your Grace is Enough', youtubeId: 'd7dW6d2-6B0' },
      
  
  ];
  return( 
    <div class="bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full">
  <VideoList videos={praiseSongs} title="Praise songs" addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList}/></div>)
};

export default PraiseSongs;