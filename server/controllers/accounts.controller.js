const accountsModel = require('../models/accounts.model');

// create a user account
async function createAccount(req, res) {
	accountsModel.createAccount(req.body);
	res.end();
}

// log in to already existing account
async function logIntoAccount(req, res) {
	return res.json(await accountsModel.validateLogin(req.body));
}

// send all account info except password
async function getAccount(req, res) {
	return res.json(await accountsModel.getAccount(req.body));
}

// edit a variety of account information like name, email, username, password, etc
async function updateAccount(req, res) {
	return res.json(await accountsModel.updateAccount(req.body));
}

// delete user account
async function deleteAccount(req, res) {
	return res.json(await accountsModel.deleteAccount(req.body));
}

module.exports = {
	createAccount,
	logIntoAccount,
	getAccount,
	updateAccount,
	deleteAccount,
};
