const mongoose = require('mongoose');

/*
* subschema to represent a singular message sent between two users.
*/
const messageSchema = new mongoose.Schema({
  //the user that is sending the message
  sender: { type: mongoose.Schema.Types.ObjectId },//the userid
  //the two users in the message, the sender user is repeted, so it is easier to
  //access the chat between two users
  users: [ { type: mongoose.Schema.Types.ObjectId } ],
  //the message sent
  text: {
    type: String,
    required: true
  },

  //indicate that the message was sucessfully delivered
  delivered: { type: Boolean, default: true},
  //when the message was sent
  timeStamp:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
