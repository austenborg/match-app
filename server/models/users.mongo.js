const mongoose = require('mongoose');

/*
*This is a Schema to represent a user in the database and the information we want to
*have directly associated with that user
*
*/
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,//will not enter the information into the database if the emaill is not unique
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v); //phone number with dashes ex. 555-555-5555
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true,
    unique: true//every user should have a different phon number
  },

  subscriptionLevel : {//subscriptions are not initialized in the server at this time, but is ready for future implementation
    type: Number,
    default: 0
  },

  //match history
  someoneSelectedYou: {//indicator for when you open the app and another user selected you from their list of matches
    type: Boolean,
    default: false
  },

  //array of every person you are currently matched with, or is currently in your list of
  //four potential matches, or was blocked/unmatched, or people who were in your match list at
  //some point but you did not select them
  matchInformation: [{
    person:{//the user id of the other user, so their iinformation can be accessed
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    },
    time:{//when they appeared on the match list
      type: Date,
      default: Date.now
    },

    matchScore: Number,

    currentMatch :{ //people you can message currently
      type: Boolean,
      default: false
    },

    weeklyMatch: {//the four potential matches
      type: Boolean,
      default: false
    },

    unmatched: {//unmatched or blocked user
      //in future alterations would make it so they could no longer appear in your weekly matches
      type: Boolean,
      default: false
    },

    notSelected: {//people who were not selected or if nobody messaged after a week
      //if nobody messaged for a week you get unmatched
      type: Boolean,
      default: false
    },

    hasMessaged: {//if either user has message
      type: Boolean,
      default: false
    }
  }]
});

module.exports =  mongoose.model('User', userSchema);
