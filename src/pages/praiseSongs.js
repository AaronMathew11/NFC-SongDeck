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
      { title: "For All You've Done - Hillsong", youtubeId: 'XTlHrmNAMQk' },
      { title: 'Amazing Love', youtubeId: 'SbN_r_6aNq0' },
      { title: 'Arise', youtubeId: 'rG6583arkmw' },
      { title: 'Ascribe Greatness to Our God', youtubeId: '02D3SMB21BI' },
      { title: 'Because He Lives', youtubeId: 'RFIr8-gH55E' },
      {
        title: 'Better is One Day in Your Courts',
        youtubeId: 'W4Fj9bbEmVk'
      },
      { title: 'Blessed Be Your Name', youtubeId: '6AB3ku_c7Dw' },
      { title: 'Break Every Chain', youtubeId: 'ucY6NwQTI3M' },
      {
        title: 'Come Let Us Worship and Bow Down',
        youtubeId: 'NEK9u51ofZE'
      },
      { title: 'Control', youtubeId: 'VghvmL0G144' },
      { title: 'Cornerstone', youtubeId: 'izrk-erhDdk' },
      { title: 'Days of Elijah', youtubeId: 'ca9LnzJnpjQ' },
      {
        title: 'Worship You for Who You Are - Hillsong',
        youtubeId: 'bjxkxJnases'
      },
      { title: 'Everlasting God', youtubeId: 'JSHRThrP1O0' },
      { title: "For All You've Done", youtubeId: 'XTlHrmNAMQk' },
      { title: 'God My Rock', youtubeId: 'bavQSfhLHhc' },
      { title: 'God of This City', youtubeId: 'cEFGr1S8SkA' },
      { title: 'God of Wonders', youtubeId: 'r9orlWiaDfM' },
      { title: 'Hallelujah to My King', youtubeId: 'vdZ5tUHrj_Q' },
      { title: 'He Walked Where I Walk', youtubeId: 'jz2TuUOl8kk' },
      { title: 'Holy is the Lord', youtubeId: 'hVWBt8bfmCs' },
      { title: 'How Great Thou Art', youtubeId: 'p-hvI1nbS80' },
      { title: 'Hosanna in the Highest', youtubeId: 'hnMevXQutyE' },
      { title: 'How Great is Our God', youtubeId: 'XV4nOVmWW2A' },
      { title: 'Hum Gaaye Hosanna', youtubeId: 'vYFxLu5o1Ig' },
      { title: 'Lion and the Lamb', youtubeId: 'q1SXPODm0uE' },
      { title: 'I Can Only Imagine', youtubeId: 'ZNDEyxEMNp0' },
      { title: 'I Will Follow', youtubeId: 'mFna4pEF7M8' },
      { title: 'For Who You Are', youtubeId: 'bjxkxJnases' },
      {
        title: 'Everlasting God - Lincoln Brewster',
        youtubeId: 'jP2nz6PG8KM'
      },
      { title: 'Indescribable God', youtubeId: '5IlVfkY5q54' },
      { title: 'Like a Fire', youtubeId: 'aQx5E7OG3YU' },
      { title: 'Mighty to Save', youtubeId: 'GEAcs2B-kNc' },
      { title: 'Never Let Go', youtubeId: 'J_n4Ysi5iUM' },
      { title: 'No One Like Jehovah', youtubeId: 'KFi6TobuVOg' },
      { title: 'O Come Let Us Adore Him', youtubeId: 'pIj6wtHN21s' },
      {
        title: 'Our God - Water You Turn Into Wine',
        youtubeId: 'NJpt1hSYf2o'
      },
      { title: "Refiner's Fire", youtubeId: 'idA6fCAHVzs' },
      { title: 'See His Love', youtubeId: 'OUKbVuIdDSw' },
      { title: 'Songs in The Night', youtubeId: 'TfkpzWwsJp8' },
      { title: 'Stronger', youtubeId: 'PsO6ZnUZI0g' },
      { title: 'The Battle Belongs to the Lord', youtubeId: 'johgSkNj3-A' },
      { title: 'Who Am I', youtubeId: 'mBcqria2wmg' },
      { title: 'Whom Shall I Fear', youtubeId: 'qOkImV2cJDg' },
      {
        title: 'Wonderful So Wonderful (Beautiful One)',
        youtubeId: '5LH9ztB-QDA'
      },
      {
        title: 'You Are God Alone (Unstoppable)',
        youtubeId: 'QLE71ay81tE'
      },
      { title: 'Prince of Peace', youtubeId: 'pnlg3zfTXZE' },
      { title: 'You Never Let Go', youtubeId: 'PgM-NIPev2w' },
      {
        title: 'Your Love is Amazing Steady and Unchanging',
        youtubeId: 'pWT3Hd6WqE0'
      }
  
  ];
  return( 
    <div class="bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full">
  <VideoList videos={praiseSongs} title="Praise songs" addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList}/></div>)
};

export default PraiseSongs;