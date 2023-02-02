const profilesModel = require('../models/profiles.model');


/*
* Function to send new profile to be added to collection
* @param req - the JSON file containing the profile information and the id of the user associated with it
* @param res - the result of the function call
*/
async function createProfile(req, res) {
    profilesModel.createProfile(req.body);
    res.end();
    // call createMatches from here??
}

/*
* Function to get the profile of a user from the userid
* @param req - the JSON file containing the userid associated with the profile we want
* @param res - the result of the function call
* @return JSON file contain the profile of the requested user
*/
async function getProfile(req, res) {
    return res.json(await profilesModel.getProfile(req.body));
}

/*
* Function to update the profile information for a spicific iser indicated by thir userid
* @param req - the JSON file containing the userid associated information we want to update
* @param res - the result of the function call
* @return JSON file contain the profile of the requested user
*/
async function updateProfile(req, res) {
    return res.json(await profilesModel.updateProfile(req.body));
}

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
}
