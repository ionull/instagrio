function StageAssistant() {
	this.TAG = 'StageAssistant';
	AppMenu.get().hide();
	AppMenu.get().hideToggle();
}

StageAssistant.prototype.setup = function() {
	AppHandler.setAppBackground("#FFFFFF");
	
	AppDB.getOAuth({
		onSuccess: function(result) {
			AppHandler.access_token = result.access_token;
			AppHandler.user = result.user;
			Mojo.Controller.stageController.pushScene('main');
		},
		onFailure: function() {
			Mojo.Controller.stageController.pushScene('connect');
		}
	});
};
