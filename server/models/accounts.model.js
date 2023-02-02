const User = require('../models/users.mongo');
const Profile = require('../models/profiles.mongo');


// add new user account to collection
async function createAccount(reqBody) {
	const user = new User(reqBody);
	user.save(function (err) {
		if (err) return handleError(err);
	});
}

// currently sends all account info except password
async function getAccount(reqBody) {
    return await User.findById(reqBody.__id, "-password");
}

// validates the login by searching for a user with same email and password
async function validateLogin(reqBody) {
	// find by key:
    return await User.find({
        email: reqBody.email,
		password: reqBody.password
    }, "__id");
}

async function updateAccount(reqBody) {
    return await User.findByIdAndUpdate(reqBody.__id, reqBody, {upsert: true});
}

async function deleteAccount(reqBody) {
	// remove user profile from profiles collection
	await Profile.findOneAndDelete({
        user: reqBody.__id
    });
	// remove user account from users collection
	return await User.findByIdAndRemove(reqBody.__id);
}

// get name, pronouns, score of a match using user id
async function getMatchInfo(reqBody) {
    var user = User.findById(reqBody.__id);
    // finds any user in weekly matches
    var match = user.MatchInformation[User.findOne({ weeklyMatch : true})];
    var matchProfile = Profile.findOne({ user: match.__id});
    var score = user.MatchInformation[User.findOne({ person: match.__id})].matchScore;
    return await {
        "score": score,
        "firstName": matchProfile.firstName,
        "pronouns": matchProfile.pronouns
    }
}

// updates matchInformation for a given user
async function updateMatches(reqBody) {
	return await User.findByIdAndUpdate(reqBody.__id, reqBody, {upsert: true});
}

// most basic version: for every user in user collection, generate four random matches
async function createMatches(reqBody) {
	var user = User.findById(reqBody.__id);
	var matches = new Array();
	// continue looking for matches until 4 are found
	while (matches.length <= 4) {
		console.log("Hi!");
		randomOffset = Math.floor(Math.random() * count);
		match = User.findOne().skip(randomOffset);
		// if match found is not user themselves or the same as the other matches
		if (match.__id != user.__id && !matches.includes(match)) {
			matches.push(match);
		}
	}
	// update user matchInformation with info of each of the 4 matches
	for (let i = 0; i < 4; i++) {
		updateMatches({
			__id: user.id,
			matchInformation: [{
				person: matches[i].__id,
				matchScore: matchScore(user, matches[i]),
				weeklyMatch: true
				// note: all other booleans should be false, and are false by default
			}]
		})
	}
	return matches;
	// old code:
	// match1 = User.findOne().skip(r1).exec(function (err, result) {
	// 	//         console.log(result)
}

// calculates a compatibility score for two users based on info in their profiles
async function findScore(userProfile, matchProfile) {
	var score = 0;
	//activities they have in common
	var userActivities = userProfile.activities;
	var matchActivities = matchProfile.activities;
	var activitySize = userActivities.length;
	var activityCount = 0;
	for (let i = 0; i < activitySize; i++) {
		if (matchActivities.some(matchActivities => matchActivities.name === userActivities[i].name)) {
			activityCount += 1;
			if (matchActivities.some(matchActivities => matchActivities === userActivities[i])) {
				//same activity and same skill level
				activityCount += .5;
			}
		}
	}
	//50 possible points
	score += (activityCount/((activitySize - 1) + (1/2)*(activitySize -1))) * 50;

	//languages they have in common
	var userLanguage = userProfile.languages;
	var matchLanguage = matchProfile.languages;
	var langSize = userLanguage.length;
	var langCount = 0;
	for (let i = 0; i < langSize; i++) {
		if (matchLanguage.indexOf(userLanguage[i]) < 0){
			langCount += 1;
		}
	}
	//5 possible points
	score += (langCount/(langSize -1))*5;

	//personality the user wants with personality the match has
	var userWantPersonality	= userProfile.personalityPreference;
	var matchPersonality = matchProfile.personality;
	var personalitySize = userWantPersonality.length;
	var personalityCount = 0;
	for (let i = 0; i < personalitySize; i++) {
		if (matchPersonality.indexOf(userWantPersonality[i]) < 0) {
			personalityCount +=1;
		}
	}
	//15 possible points
	score += (personalityCount/ (personalitySize -1))*15;

	//location
	score += 15;

	//match age is in prefered age range
	if (matchProfile.age >= userProfile.ageRange.minimum && matchProfile.age <= userProfile.ageRange.maximum) {
		score += 15;
	}

	return score;
}

// updates a potential match to be a current match
async function chooseMatch(reqBody) {
	// find the user and match by Id
	var user = User.findById(reqBody.__id);
	var match = user.matchInformation[findById(reqBody.person)];

	// update the specific match in user match information
	User.matchInformation.findOneAndUpdate({"person" : match}, {
		currentMatch: true,
		weeklyMatch: false
	}, {upsert: true} )

	// update match's match information to have user who selected them as a match
	User.updateMatches({
		__id: match.__id,
		matchInformation: [{
			person: user.__id,
			currentMatch: true
		}]
	})
}

module.exports = {
    createAccount,
	getAccount,
	validateLogin,
	updateAccount,
    deleteAccount,
	getMatchInfo,
	updateMatches,
	createMatches, 
	findScore,
	chooseMatch,
}