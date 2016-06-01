const Fs = require('fs');
const OPENPLATFORM = global.OPENPLATFORM = {};
const HEADERS = {};

HEADERS['x-openplatform'] = CONFIG('version');
HEADERS['x-openplatform-url'] = CONFIG('url');

OPENPLATFORM.Application = MODEL('model-application').Application;
OPENPLATFORM.User = MODEL('model-user').User;
OPENPLATFORM.users = {};
OPENPLATFORM.applications = {};

/**
 * Finds user by its ID
 * @param {String} id
 * @return {User}
 */
OPENPLATFORM.users.find = function(id) {
	for (var i = 0, length = USERS.length; i < length; i++) {
		if (USERS[i].id === id)
			return USERS[i];
	}
}

/**
 * Saves users
 * @return {Boolean}
 */
OPENPLATFORM.users.save = function(callback) {
	Fs.writeFile(F.path.databases('users.json'), JSON.stringify(USERS), callback);
	return true;
};

/**
 * Loads users
 * @return {Boolean}
 */
OPENPLATFORM.users.load = function(callback) {
	Fs.readFile(F.path.databases('users.json'), function(err, data) {

		callback && setImmediate(callback(err));

		if (!data)
			return;

		USERS = data.toString('utf8').parseJSON();

		for (var i = 0, length = USERS.length; i < length; i++) {
			var item = USERS[i];
			if (item.dateupdated)
				item.dateupdated = new Date(item.dateupdated);
			if (item.datecreated)
				item.datecreated = new Date(item.datecreated);
			if (item.datelast)
				item.datelast = new Date(item.datelast);
			if (item.datelogged)
				item.datelogged = new Date(item.datelogged);
		}

	});

	return true;
};

/**
 * Saves applications
 * @return {Boolean}
 */
OPENPLATFORM.applications.save = function(callback) {
	Fs.writeFile(F.path.databases('applications.json'), JSON.stringify(APPLICATIONS), callback);
	return true;
};

OPENPLATFORM.applications.create = function(url, callback) {
	var app = new OPENPLATFORM.Application();
	app.openplatform = url;
	app.reload(function(err) {
		callback(err, app);
	});
};

/**
 * Loads users
 * @return {Boolean}
 */
OPENPLATFORM.applications.load = function(callback) {
	Fs.readFile(F.path.databases('applications.json'), function(err, data) {

		callback && setImmediate(callback(err));

		if (!data)
			return;

		APPLICATIONS = data.toString('utf8').parseJSON();

		for (var i = 0, length = APPLICATIONS.length; i < length; i++) {
			var item = APPLICATIONS[i];
			if (item.dateupdated)
				item.dateupdated = new Date(item.dateupdated);
			if (item.datecreated)
				item.datecreated = new Date(item.datecreated);
		}

	});

	return true;
};

OPENPLATFORM.applications.uid = function(url) {
	return url.toLowerCase().replace(/^(http|https)\:\/\//g, '').replace(/www\./g, '').trim().hash();
};