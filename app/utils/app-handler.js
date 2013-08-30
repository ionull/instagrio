var AppHandler =  {};

AppHandler.TAG = 'AppHandler';

/*
 * reqInfo {
 * 		url: url,
 * 		urlParams: urlParams,
 * 		postParams: postParams
 * }
 */
AppHandler.onSuccess = function(callback, transport, reqInfo) {
	Mojo.Log.info(AppHandler.TAG, 'onSuccess ' + reqInfo.urlParams['doing']);
	var result = transport.responseJSON;
	Mojo.Log.error(AppHandler.TAG, JSON.stringify(result));
	Mojo.Log.info(AppHandler.TAG, callback.nextMaxId);
	var doing = reqInfo.urlParams['doing']; 
	if(callback.nextMaxId) {
		transport.more = true;
	}
	callback.onSuccess(transport);
};

AppHandler.onFailure = function(callback, transport, reqInfo) {
	callback.onFailure(transport);
};

AppHandler.access_token = null;

AppHandler.onUserClicked = function(opt) {
	//TODO switch to user scene
	var item = AppHandler.photoListHelper.modelList.items[opt];
	Mojo.Controller.stageController.pushScene('user', item);
	//Mojo.Controller.stageController.pushScene('user', opt);
};

AppHandler.alert = function(msg) {
	//Mojo.Log.info(AppHandler.TAG, 'alert');
	Mojo.Controller.getAppController().showBanner({
				messageText: msg
			}, 'CommonAlert', 'CommonAlert');
};

AppHandler.setAppBackground = function(document, color){
	if(document && document.body) {
		document.body.style.background = color;
	}
};
