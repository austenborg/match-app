const mongoose = require('mongoose');

//possible way to handle location, we were not able to implement it at this time
// const pointSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['Point'],
//     required: true
//   },
//   coordinates: {
//     type: [Number],//longitude and lattatude
//     required: true
//   }
// });

/*
* SubSchema to set a range of ages you would prefer to be matched with
*
*/
const ageRangeSchema = mongoose.Schema({
  minimum: {
    type: Number,
    min: 18,
    default: 18
  },
  maximum:{
    type: Number,
    max: 110,
    default: 110
  }
});

/*
*subSchema for when people are avalable. It trpresents a
*singular block of continous time
*/
const availabilitySchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date
});

/*
* subSchema for the activity that someone does/enjoys and their relitive skill level
* from 1-3 representing beginner intermediate and advanced. The Schema represents one
* activvity with its associated skill level
*/
const activitySchema = new mongoose.Schema({
  name:{
    type: String,
  },
  level:{
    type: Number,
    min: 1,
    max: 3
   }
});

/*
* subschema for how images will be stored in the database.
*/
const imageSchema = new mongoose.Schema({
    name: String,
    img: {
      data: Buffer,
      contentType: String
    }
});

/*
* subschema for how a user's profile will be stored in the database. Each profile will be asssigned a
* different user.
*/
const profileSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18
  },

  //  location: Point,

  pronouns: String,
  //an array of all the activities the person selected formated by the activityschema
  activities: [activitySchema],

  //array of all the lamguages someone speaks casually
  languages: [{
    type: String,
    default: 'English'
  }],

  //the last time they used the app
  lastActive:{
    type: Date,
    default: Date.now
  },

  verified:{
    type: Boolean,
    default: false
  },

  //if the user's account is currently actuve (this information is stored in the profile
  //because we want to eventually use the profiles to reate matches, and having all the necessary information
  //in one place will be helpful)
  active: {
    type: Boolean,
    default: true
  },
  //string of personalitytraits the user thinks represents them
  personality: [String],

  //and array of all the images a user wishes to put in their profile
  images: [imageSchema],

  //an array containing all of the time blocks they are currently avalible
  //can be continously updated, future implementations will have a method to delete
  //the times that have already passed.
  avalibility: [availabilitySchema],


    //preferences the user has for who they want to match with
    personalityPreference: [String],//the persomality traits they like in other people
    ageRange: ageRangeSchema,
    maxDistance: { type: Number, default: 30 }, //miles

  user: {
    type: mongoose.Schema.Types.ObjectId, //the profile of the user that will be assigned to the profile
    ref: 'User',
    required: true,
    unique: true
  },
});

module.exports = mongoose.model('Profile', profileSchema);
