//brainbreaks.js
//List of all brain breaks
//Brain Breaks are stored on Amazon AWS - S3
//https://s3.console.aws.amazon.com/s3/buckets/brainbreaks/?region=us-east-1&tab=overview
'use strict';

module.exports = [
  // {
  //   "name": "name of Brain Break",
  //   "category": "category of Brain Break",
  //   "url": "Link to the Brain Break from Amazon AWS - S3"
  // },
  {
    "name": "Keep It Clean",
    "category": "clean",
    "url": "https://s3.amazonaws.com/brainbreaks/remastered/Keep It Clean.mp3",
  },
  {
    "name": "test",
    "category": "dance",
    "url":"https://s3.amazonaws.com/brainbreaks/Brick.mp3"
  },
  {
    "name": "Finger Snatch",
    "category": "music",
    "url": "https://s3.amazonaws.com/brainbreaks/remastered/Finger+Snatch.mp3",
  },
  {
    "name": "High Claps",
    "category": "exercise",
    "url": "https://s3.amazonaws.com/brainbreaks/remastered/High+Fives.mp3",
  },
  {
    "name": "Pop",
    "category": "counting",
    "url": "https://s3.amazonaws.com/brainbreaks/remastered/Pop.mp3",
  },
  {
    "name": "Rollercoaster",
    "category": "fun",
    "url": "https://s3.amazonaws.com/brainbreaks/remastered/Rollercoaster.mp3",
  },
  // {
  //   "name": "Spelling Baseball",
  //   "category": "spelling",
  //   "url": "https://s3.amazonaws.com/brainbreaks/remastered/Spelling Baseball.mp3",
  // },
  {
    "name": "Switch It Up",
    "category": "sunny",
    "url": "https://s3.amazonaws.com/brainbreaks/remastered/Switch It Up.mp3",
  },
  ];

