import React from 'react';
import VideoList from '../Components/videoList';

const transitionalSongs = ({addVideoToList, removeVideoFromList}) => {
  
  const transitionSongs = 
    [
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
      },
      {
        title: 'You are worthy of my praise',
        youtubeId: 'bktcek7iNvE'
      },
      {
        title: 'Touch of Heaven',
        youtubeId: 'sWwHBZm3HIA'
      },
      {
        title: 'Give us your heart',
        youtubeId: 'gLYV43SBARg'
      },
      {
        title: 'Easy',
        youtubeId: 'sa93t5kmoUQ'
      }

      
  
  ];
  return (
    <VideoList 
      videos={transitionSongs} 
      title="Transitional Songs" 
      subtitle="Songs that bridge the energy of praise and the depth of worship" 
      addVideoToList={addVideoToList} 
      removeVideoFromList={removeVideoFromList}
    />
  )
};

export default transitionalSongs;