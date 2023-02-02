const Profile = require('../models/profiles.mongo');


/*
* add new profile to collection and link to user account
* @param reqBody - the JSON file being sent to the server with the new profile information
*/
async function createProfile(reqBody) {
    const profile = new Profile(reqBody);
    profile.save(function (err) {
		if (err) return handleError(err);//handle error is not currently implemented
	});
}

/*
* get the profile of the user indecated by the user id
* @param reqBody - the JSON file being sent to the server with the userid for the desired profile
*
* @return the JSON file with all of the profile information assigned to that user
*/
async function getProfile(reqBody) {
    // find by id:
    return await Profile.find({
        user: reqBody.user
    });
}

/*
* update a profile that is alrady in the database
* @param reqBody - the JSON file being sent to the server with the new profile information and the userid associatedd with it
* @return it will return the updated profile
*/
async function updateProfile(reqBody) {
    return await Profile.findOneAndUpdate({
        user: reqBody.user
    }, reqBody, {upsert: true});//upsert will uptate information alreay there and insert any new information
}

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
}
