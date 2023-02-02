const messagesModel = require('../models/messages.model');

// whenever a new message is sent, even the first one
async function postMessage(req, res) {
    messagesModel.postMessage(req.body);
    res.end();
}

// requested when chat page is displayed, send back info for preview of all chats
async function getChats(req, res) {
    return res.json(await messagesModel.getChats(req.body));
}

// requested when a specific chat between two users is opened
async function getMessages(req, res) {
    return res.json(await messagesModel.getMessages(req.body));
}

// sends two user ids to have all messages between them deleted
async function deleteChat(req, res) {
    return res.json(await messagesModel.deleteChat(req.body));
}

module.exports = {
    postMessage,
    getChats,
    getMessages,
    deleteChat,
}
