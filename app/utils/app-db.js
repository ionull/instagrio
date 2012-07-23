function AppDB() {
	//
}

AppDB.TAG = 'AppDB';

AppDB.Setting = {
	'DB_OAUTH_KEY' : 'oauth'
}

/**
 * getUser if exist
 * @param {Object} callback 
 * 	{
 * 		onSuccess: onSuccess, 
 * 		onFailure: onFailure
 * 	}
 */
AppDB.getOAuth = function(callback) {
	DBHelper.instance().get(AppDB.Setting.DB_OAUTH_KEY, callback.onSuccess, callback.onFailure);
};

/**
 * add or replace User login info, for auto login by ticket
 * if userData is null, the old one will be removed
 * @param {Object} userData
 * {
 * 		uid: uid,
 * 		access_token: access_token
 * }
 */
AppDB.saveOAuth = function(data) {
	DBHelper.instance().add(AppDB.Setting.DB_OAUTH_KEY, data);
}

AppDB.removeOAuth = function(callback) {
	DBHelper.instance().remove(AppDB.Setting.DB_OAUTH_KEY, callback);
}
