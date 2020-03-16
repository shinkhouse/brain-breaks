/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
//Hello
const Alexa = require('alexa-sdk');               //required node_module alexa_sdk
const brainBreaks = require('./brainbreaks');     //required brainbreaks.js file

//APP_ID links to Amazon Alexa Developer Console
const APP_ID = "amzn1.ask.skill.c7a4c0fe-1df6-4903-8b6e-34dae27fa229"; // TODO replace with your app ID (OPTIONAL).

//If you view Brain Breaks in the Alexa app on your phone or use in on an Echo Show, it will show this information.
var streamInfo = {
  title: 'Brain Breaks',
  subtitle: 'Brain Breaks provide short bursts of physical and mental activity proven to reduce learning fatigue.',
  //cardContent: "",
  //url: 'https://s3.amazonaws.com/brainbreaks/Brick.mp3',
  image: {
    largeImageUrl: 'https://s3.amazonaws.com/brainbreaks/BrainBreaksLarge.png',
    smallImageUrl: 'https://s3.amazonaws.com/brainbreaks/BrainBreaksSmall.png'
  }
};

var currentBrainBreak = {};                     //Initializing an empty object for the active brain break later on
var currentBrainBreakPosition = 0;              //Position used to remember what the current brain break is in the list
var previousBrainBreakPosition = 0;             //Position used to remember what the previous brain break is in the list if user wants to go back to previous one
exports.handler = (event, context, callback) => {
  var alexa = Alexa.handler(event, context, callback);

  alexa.registerHandlers(
    handlers,                                   //handlers is an object that has the various functions Brain Breaks will use. See handlers variable below
    audioEventHandlers
  );

  alexa.execute();
};

//This object has the functions Brain Breaks uses. 
var handlers = {
  //This function is called in multiple places... it gets called at the end of the search functions, PlayStream function, next and previous functions, etc. 
  //It takes the name and url and uses the audio player function of the Alexa SDK to play the brain breaks URL.
  'playBrainBreaks': function() {
    //this.response.speak is what Alexa says. 
    this.response.speak('Now playing, ' + currentBrainBreak.name).audioPlayerPlay('REPLACE_ALL', currentBrainBreak.url, currentBrainBreak.url, null, 0);
    this.emit(':responseReady');
  },
  'LaunchRequest': function() {
    //This calls the PlayStream function
    this.emit('PlayStream');
  },
  //Default callback function that starts Brain Breaks. Ex: "Open Brain Breaks"
  'PlayStream': function() {
    // brainBreaks[Math.floor(Math.random()*brainBreaks.length)].url;
    previousBrainBreakPosition  = currentBrainBreakPosition;
    currentBrainBreakPosition = Math.floor(Math.random() * brainBreaks.length);
    console.log(brainBreaks[currentBrainBreakPosition].url);
    // this.response.speak('Enjoy.').audioPlayerPlay('REPLACE_ALL', streamInfo.url, streamInfo.url, null, 0);
    var brainBreakUrl = brainBreaks[currentBrainBreakPosition];
    currentBrainBreak = brainBreakUrl;
    this.emit('playBrainBreaks')
  },
  //Allows user to search for brain break by category, name.
  'searchBrainBreaks': function() {
    var categorySpecificResults = [];
  //Checks if slot type is a category. 
    if (this.event.request.intent.slots["category"].value) {
      previousBrainBreakPosition  = currentBrainBreakPosition;
      for (var i = 0; i < brainBreaks.length; i++) {
        //This checks if the searched category matches the category for a brain break in the list
        //If it does, it gets pushed to a categorySpecificResults list
        if (brainBreaks[i].category.toLowerCase().valueOf() === this.event.request.intent.slots["category"].value.toLowerCase().valueOf()) {
          categorySpecificResults.push(brainBreaks[i]);
        }
      }
      //If there are brain breaks from the category, one is selected at random and gets played.
      if (categorySpecificResults.length > 0) {
        currentBrainBreakPosition = Math.floor(Math.random() * categorySpecificResults.length);
        var categoryUrl = categorySpecificResults[currentBrainBreakPosition];
        currentBrainBreak = categoryUrl;
        this.emit('playBrainBreaks');
      }
      //If no brain breaks are found from the searched category, this message will be played to the user
      else {
        this.response.speak('We couldn\'t find that category. Please try again.');
        this.emit(':responseReady');
      }
    }
  //Checks if slot type is a name. 
    else if (this.event.request.intent.slots["name"].value) {
      previousBrainBreakPosition  = currentBrainBreakPosition;   //This will let Alexa know which Brain Break was play previously
      var searchWordValid = false;
      for (var i = 0; i < brainBreaks.length; i++) {
        //Checks if the searched name matches the name for a brain break in the list
        if (brainBreaks[i].name.toLowerCase().trim().valueOf() === this.event.request.intent.slots["name"].value.toLowerCase().trim().valueOf()) {
          currentBrainBreakPosition = i;
          var nameUrl = brainBreaks[i];
          searchWordValid = true;       //If a brain break was found, searchWordValid becomes true.
        }
      }
      //If there is a brain break found, it will be played.
      if (searchWordValid) {
        currentBrainBreak = nameUrl;
        this.emit('playBrainBreaks');
      }
      //If no brain break is found from the searched name, this message will be played to the user
      else {
        this.response.speak('We couldn\'t find that brain break. Please try again.');
        this.emit(':responseReady');
      }
    }
  },
  //If the user asks how to use Brain Breaks, this message will be played
  //This message will give a couple suggestioned phrases to say including a random Brain Break name.
  'AMAZON.HelpIntent': function() {
    var brainBreakUrl = brainBreaks[Math.floor(Math.random() * brainBreaks.length)];
    this.response.speak('You can use this app by saying something like, Alexa, open Brain Breaks or, Alexa, ask Brain Breaks to open ' + brainBreakUrl.name);
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    // no session ended logic needed
  },
  'ExceptionEncountered': function() {
    console.log("\n---------- ERROR ----------");
    console.log("\n" + JSON.stringify(this.event.request, null, 2));
    this.callback(null, null)
  },
  'Unhandled': function() {
    this.response.speak('Sorry. Something went wrong.');
    this.emit(':responseReady');
  },
  
  //Skips to the next brain break in the array, loops back to beginning if next() hits the end of array.
  'AMAZON.NextIntent': function() {
    if(currentBrainBreakPosition == (brainBreaks.length - 1)) {
      currentBrainBreakPosition = 0;
      var brainBreakUrl = brainBreaks[currentBrainBreakPosition];
      currentBrainBreak = brainBreakUrl;
      this.emit('playBrainBreaks')
     } else {
      var brainBreakUrl = brainBreaks[++currentBrainBreakPosition];
      currentBrainBreak = brainBreakUrl;
      this.emit('playBrainBreaks')
     }
  },
  
  //Skips to the previous brain break in the array, loops back to the end if next() hits the beginning of array.
  'AMAZON.PreviousIntent': function() {
    if(currentBrainBreakPosition == 0) {
      currentBrainBreakPosition = brainBreaks.length - 1;
      var brainBreakUrl = brainBreaks[currentBrainBreakPosition];
      currentBrainBreak = brainBreakUrl;
      this.emit('playBrainBreaks')
     } else {
      var brainBreakUrl = brainBreaks[--currentBrainBreakPosition];
      currentBrainBreak = brainBreakUrl;
      this.emit('playBrainBreaks')
     }
  },
  //Pause function calls StopIntent
  'AMAZON.PauseIntent': function() {
    this.emit('AMAZON.StopIntent');
  },
  //Cancel function calls StopIntent
  'AMAZON.CancelIntent': function() {
    this.emit('AMAZON.StopIntent');
  },
  //StopIntent closes the Brain Breaks skill with ending message.
  'AMAZON.StopIntent': function() {
    this.response.speak('Thanks for using Brain Breaks. Good bye!').audioPlayerStop();
    this.emit(':responseReady');
  },
  //This function hasn't been implemented yet, so it will play a new Brain Break.
  'AMAZON.ResumeIntent': function() {
    this.emit('PlayStream');
  },
  //This function hasn't been implemented yet, so it will play a new Brain Break.
  'AMAZON.LoopOnIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  //This function hasn't been implemented yet, so it will play a new Brain Break.
  'AMAZON.LoopOffIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  //This function hasn't been implemented yet, so it will play a new Brain Break.
  'AMAZON.ShuffleOnIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  //This function hasn't been implemented yet, so it will play a new Brain Break.
  'AMAZON.ShuffleOffIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  //This function hasn't been implemented yet, so it will play a new Brain Break.
  'AMAZON.StartOverIntent': function() {
    this.emit('playBrainBreaks')
  },
  'PlayCommandIssued': function() {
    if (this.event.request.type === 'IntentRequest' || this.event.request.type === 'LaunchRequest') {
      var cardTitle = streamInfo.subtitle;
      var cardContent = streamInfo.cardContent;
      var cardImage = streamInfo.image;
      this.response.cardRenderer(cardTitle, cardContent, cardImage);
    }

    this.response.speak('Enjoy this.').audioPlayerPlay('REPLACE_ALL', brainBreaks[Math.floor(Math.random() * brainBreaks.length)].url, brainBreaks[Math.floor(Math.random() * brainBreaks.length)].url, null, 0);
    this.emit(':responseReady');
  },
  //This function hasn't been implemented yet, so it will stop playing the Brain Break all together.
  'PauseCommandIssued': function() {
    this.emit('AMAZON.StopIntent');
  }
}

//Returns the link of a random brain break URL. This is no longer being used.
function playRandomBrainBreak() {
  return brainBreaks[Math.floor(Math.random() * brainBreaks.length)].url;
}

var audioEventHandlers = {
  'PlaybackStarted': function() {
    this.emit(':responseReady');
  },
  'PlaybackFinished': function() {
    this.emit(':responseReady');
  },
  'PlaybackStopped': function() {
    this.emit(':responseReady');
  },
  'PlaybackNearlyFinished': function() {
    // this.response.audioPlayerPlay('REPLACE_ALL', streamInfo.url, streamInfo.url, null, 0);
    // this.response.audioPlayerPlay('REPLACE_ALL', brainBreaks[Math.floor(Math.random() * brainBreaks.length)].url, brainBreaks[Math.floor(Math.random() * brainBreaks.length)].url, null, 0);
    this.emit(':responseReady');
  },
  'PlaybackFailed': function() {
    this.response.audioPlayerClearQueue('CLEAR_ENQUEUED');
    this.emit(':responseReady');
  }
}
