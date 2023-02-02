const Message = require('./messages.mongo');
const User = require('../models/users.mongo');

//
/*
* store a message in the database. function will be called
* whenever a new message is sent, even the first one.
* @param reqBody - the JSON file being sent to the server with the userid of the sender
* the userid of the person who is receving the message and the message
*/
async function postMessage(reqBody) {
    const message = new Message(reqBody);
    message.save(function (err) {
        if (err) return handleError(err);
    });
}

/*
* send back info for preview of all chats when chat page is displayed in UI
* @param reqBody - the JSON file containing a user
* @return name and latest message of all matches of that user
*/
async function getChats(reqBody) {
    // find user
    var user = User.find({
        user: reqBody.user
    });
    // if user already has a chat with that match
    if (user.matchInformation[0].person.hasMessaged == true) {
        var match = user.matchInformation[0].person
    };
    var matchName = match.findById(match.__id, "name");
    var lastMessage = getMessages(reqBody, 1);
    return await {
        name: matchName,
        message: lastMessage
    }
}

/*
* get the most recent 20 messages, or all the messages if less than
* 20 have been sent, between two users who have a chat.
* @param reqBody - the JSON file containing the two users who are in the chat
* @return the most recent 20 messages ordered from most recent to least recent, or all messages if less than 20 have been sent
*/
async function getMessages(reqBody, num = 20) {
    return await Message.find({ "$or": [
        { users: [ reqBody.user1, reqBody.user2 ] },
        { users: [reqBody.user2, reqBody.user1] }
     ]})
    .sort({ timeStamp: -1 })
    .limit(num) // the most recent <num> messages
}

/*
* delete all of the messages that have been sent between two users
* @param reqBody - the JSON file containing the two users who are in the chat
* @return should not return anything unless thre is an error
*/
async function deleteChat(reqBody) {
    return await Message.deleteMany({ "$or": [ //the users can be in the array in any order
       { users: [ reqBody.user1, reqBody.user2 ] },
       { users: [reqBody.user2, reqBody.user1] }
    ]})
}

module.exports = {
    postMessage,
    getChats,
    getMessages,
    deleteChat
}
