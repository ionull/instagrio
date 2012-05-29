function AppDB() {
	//
}

AppDB.TAG = 'AppDB';

AppDB.Setting = {
	'DB_NAME' : 'instagrio.db',
	'DB_DISPLAY_NAME' : 'instagrioDB',
	'DB_VERSION' : 0.1,
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
	AppDB.getValue(callback, AppDB.Setting.DB_OAUTH_KEY);
};
AppDB.getValue = function(callback, key) {
	var db = new Mojo.Depot({
		name: AppDB.Setting.DB_NAME,
		version: AppDB.Setting.DB_VERSION,
		displayName: AppDB.Setting.DB_DISPLAY_NAME,
		replace: false
	}, function() {
		Mojo.Log.info(AppDB.TAG, 'db connected');
		db.get(key, function(result) {
			var recordSize = Object.values(result).size();
			if(recordSize == 0) {
				Mojo.Log.info(AppDB.TAG, 'user got zerrrro');
				callback.onFailure();
			} else {
				Mojo.Log.info(AppDB.TAG, 'user got');
				callback.onSuccess(result);
			}
		}, function() {
			Mojo.Log.info(AppDB.TAG, 'userid get error');
			callback.onFailure();
		});
	}, function() {
		Mojo.Log.info(AppDB.TAG, 'db connect error');
		callback.onFailure();
	});
}

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
	AppDB.saveValue(AppDB.Setting.DB_OAUTH_KEY, data);
}

AppDB.saveValue = function(key, userData) {
	var db = new Mojo.Depot({
		name: AppDB.Setting.DB_NAME,
		version: AppDB.Setting.DB_VERSION,
		displayName: AppDB.Setting.DB_DISPLAY_NAME,
		replace: false
	}, function() {
		Mojo.Log.info(AppDB.TAG, 'db connected');
		db.get(key, function(response) {
			Mojo.Log.info(AppDB.TAG, 'user got');
			var recordSize = Object.values(response).size();
			if(recordSize == 0) {
				Mojo.Log.info(AppDB.TAG, 'user got zerrrro');
				//TODO add new record
				db.add(key, userData, function() {
						Mojo.Log.info(AppDB.TAG, 'user add success');
					}, function() {
						Mojo.Log.info(AppDB.TAG, 'user add error');
					});
			} else {
				Mojo.Log.info(AppDB.TAG, 'user exist, to update');
				//TODO update exist record
				db.discard(key, function() {
					Mojo.Log.info(AppDB.TAG, 'user discard success');
					if(userData != null) {
						db.add(key, userData, function() {
							Mojo.Log.info(AppDB.TAG, 'user add success');
						}, function() {
							Mojo.Log.info(AppDB.TAG, 'user add error');
						});
					}
				}, function() {
					Mojo.Log.info(AppDB.TAG, 'user discard error');
				});
			}
		}, function() {
			Mojo.Log.info(AppDB.TAG, 'user get error');
		});
	}, function() {
		Mojo.Log.info(AppDB.TAG, 'db connect error');
	});
}
