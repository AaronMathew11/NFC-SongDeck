import React from 'react';
import { useState } from 'react';
import VideoList from '../Components/videoList';

const CoreWorship = ({addVideoToList, removeVideoFromList}) => {
  
  const worshipSongs = 
  [
    {
      title: 'Enter the holy of holies - Paul Wilbur',
      youtubeId: 's4CRvAPzxjI'
    },
    {
      title: 'Spirit of the Sovereign Lord - Paul Wilbur',
      youtubeId: '1YAwH75vLl4'
    },
    { title: 'Kadosh - Paul Wilbur', youtubeId: 'bSMDz1fpHxE' },
    { title: 'Take me in - Petra / Kutless', youtubeId: 'y1vJrX976kQ' },
    { title: 'Cornerstone - Hillsong', youtubeId: 'izrk-erhDdk' },
    { title: 'Aasma se bhi - Anil Kant', youtubeId: '3Er1Qw8zbnc' },
    { title: 'Above All - Hillsong', youtubeId: '5_cxhf5ISeg' },
    { title: 'Agnus Dei', youtubeId: 'har4itYxlBg' },
    { title: 'All to Jesus I Surrender', youtubeId: 'SW8EA7DEQ2M' },
    { title: 'As the deer pants for', youtubeId: 'FBppKZ0eJlQ' },
    { title: 'Aradhana hum karte hai', youtubeId: 'X8Gg_qGdPso' },
    {
      title: 'Amazing Grace (My Chains are gone)',
      youtubeId: 'Y-4NFvI5U9w'
    },
    { title: 'Blessing and honor, Your Name', youtubeId: '1tkxGW1w_Nk' },
    { title: 'Broken Vessels', youtubeId: 'uz9xKtRhpjc' },
    { title: 'Create in me a new heart', youtubeId: 'b7Hk3WFUMvo' },
    { title: 'Crown Him with many crowns', youtubeId: 'YuMh_ept-Js' },
    {
      title: 'Father God I wonder how I managed to exist',
      youtubeId: 'nPT8tzdC_sw'
    },
    { title: 'Your Grace is Enough', youtubeId: 'YvIB_veig5s' },
    { title: 'Glory to Him who has saved us', youtubeId: '65P4SVAqRP4' },
    { title: 'Heart of Worship', youtubeId: 'OD4tB1o6YLw' },
    { title: 'Good good Father', youtubeId: 'CqybaIesbuA' },
    { title: 'Healing is here', youtubeId: 'UFSVWeCe-R4' },
    { title: 'Here I am (Majesty)', youtubeId: 'vNjH8QDpBFY' },
    { title: 'Lovely Lord', youtubeId: '_jIjBuuA87E' },
    { title: 'Here I am to worship', youtubeId: '6CKCThJB5w0' },
    { title: 'Here in Your presence', youtubeId: 'jkkWOUZNI0U' },
    { title: 'I Surrender', youtubeId: 's7jXASBWwwI' },
    {
      title: 'We will worship the lamb of glory - DENNIS JERNIGAN',
      youtubeId: '0qXPKITolQU'
    },
    {
      title: 'We will worship the lamb of glory',
      youtubeId: 'qmzwFA2TwUk'
    },
    { title: 'In Christ alone', youtubeId: 'rn9-UNer6MQ' },
    { title: 'No longer slaves', youtubeId: 'f8TkUMJtK5k' },
    { title: 'Oceans', youtubeId: 'OP-00EwLdiU' },
    { title: 'Once Again', youtubeId: 'zinU3nPNxC8' },
    { title: 'Our God is an awesome God', youtubeId: 'PP9BjKnDaFk' },
    { title: 'Rescue', youtubeId: 'gYR0xP1j4PY' },
    {
      title: 'Shout to the Lord (My Jesus, My Savior)',
      youtubeId: '5_aIauL2xKA'
    },
    { title: 'Shukriya', youtubeId: 'bZUZSLYxK5A' },
    { title: 'Sings my Soul', youtubeId: '5TQWX_EOR_g' },
    {
      title: 'Take Me into the Holy of Holies',
      youtubeId: 'JuziDS_4EBI'
    },
    {
      title: 'Tere paas aata hu Yeshu Tere paas',
      youtubeId: 'p4waaA11CcA'
    },
    { title: "Victor's Crown", youtubeId: '_2nBOGA6X2g' },
    { title: 'We fall down we lay our crowns', youtubeId: '7Ge9O_HOKcE' },
    {
      title: 'Yeshu Masih Tere Jaisa hai koi nahi',
      youtubeId: '82MsQth2kPk'
    },
    { title: 'Yeshu Naam Yeshu Naam', youtubeId: '8Y2XpaX3aX0' },
    { title: 'You Alone Are Worthy', youtubeId: 'yb9sE07i7kw' },
    { title: 'You are Beautiful', youtubeId: 'oofSnsGkops' },
    {
      title: 'You Deserve the Glory and the Honor',
      youtubeId: 'Asvp4ysmhVE'
    },
    {
      title: 'For Your name is holy - Paul Wilbur',
      youtubeId: 's4CRvAPzxjI'
    },
    {
      title: 'Breath',
      youtubeId: 'KqNeIqvpdjw'
    },
    {
      title: 'What love, my God',
      youtubeId: 'CjXK9PdCpis'
    },
    {
      title: 'Oh The Cross',
      youtubeId: 'HyR_Pnggv_A'
    },
    {
      title: 'Boldly I Approach',
      youtubeId: 'Xx94Fg4qZr8'
    },
    {
      title: 'When Wind Meets Fire',
      youtubeId: '7Q5d6zvf8Q'
    },
      {
        title: 'Been So Good',
        youtubeId: 'D3yMC_qoAes'
      }

    

    
  ]
  return ( <div class="bg-white h-screen w-full">
 <VideoList videos={worshipSongs} title="Worship songs" subtitle="Core worship songs to deepen intimacy and reverence for God." addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList}/></div>)
};

export default CoreWorship;