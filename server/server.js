const express = require('express');
const mongoose = require('mongoose');

const accountsController = require('./controllers/accounts.controller');
const chatsController = require('./controllers/chats.controller');
const matchesController = require('./controllers/matches.controller');
const profilesController = require('./controllers/profiles.controller');

const app = express();

const PORT = 8080;

app.use(express.json());

const MONGO_URL = 'mongodb+srv://admin:5!s6KHkchS7ZpZF@cluster0.h66sq.mongodb.net/click?retryWrites=true&w=majority';

// accounts requests
app.post('/createAccount', accountsController.createAccount);
app.get('/logIn', accountsController.logIntoAccount);
app.get('/getAccount', accountsController.getAccount);
app.put('/updateAccount', accountsController.updateAccount);
app.delete('/deleteAccount', accountsController.deleteAccount);

// chats requests
app.post('/sendMessage', chatsController.postMessage);
app.get('/chats', chatsController.getChats);
app.get('/messages', chatsController.getMessages);
app.delete('/deleteChat', chatsController.deleteChat);

// matches requests
app.get('/matchInfo', matchesController.getMatchProfile,);
app.put('/testMatch', matchesController.testMatch);
app.put('/chooseMatch', matchesController.chooseMatch);

// profiles requests
app.post('/createProfile', profilesController.createProfile);
app.get('/getProfile', profilesController.getProfile);
app.put('/updateProfile', profilesController.updateProfile);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function startServer() {
    await mongoose.connect(MONGO_URL);

    app.listen(PORT, () => {
        console.log('Listening on '+PORT+'...');
    });
  }

  startServer();
