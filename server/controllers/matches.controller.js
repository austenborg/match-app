const accountsModel = require('../models/accounts.model');

// get name, pronouns of a user
async function getMatchProfile(req, res) {
    return res.json(await accountsModel.getMatchInfo(req.body));
}

// creates matches
async function testMatch(req, res) {
    return res.json(await accountsModel.createMatches(req.body));
}

// takes request with a user and match in it and chooses that match from potential matches
async function chooseMatch(req, res) {
    return res.json(await accountsModel.chooseMatch(req.body));
}

module.exports = {
    getMatchProfile,
    testMatch,
    chooseMatch
};