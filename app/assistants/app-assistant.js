function AppAssistant() {};

AppAssistant.helper = {
	verifyAuth: function(onSuccess) {
		AppDB.getOAuth({
			onSuccess: function(result) {
				AppHandler.access_token = result.access_token;
				AppHandler.user = result.user;
				onSuccess();
			},
			onFailure: function() {
				Mojo.Controller.stageController.pushScene('connect');
			}
		});
	}
};

AppAssistant.prototype = {
	setup: function() {},
	handleLaunch: function(launchParams) {
		Mojo.Log.error('handleLaunch: ' + JSON.stringify(launchParams));
		if (launchParams) {
			switch (launchParams.action) {
			case 'search-user':
				AppAssistant.helper.verifyAuth(function() {
					//search and get list
					AppMenu.get().showToggle();
					Mojo.Controller.stageController.pushScene('user-list', 'search', launchParams.data);
				});
				break;
			default:
				if (launchParams.dockMode || launchParams.action == 'dock-mode') {
					AppAssistant.helper.verifyAuth(function() {
						Mojo.Controller.stageController.pushScene('photo-gallery', 'dock-mode');
					});
				}
				break;
			}
		} else {
			var stage = Mojo.Controller.stageController;
			if (!stage || ! stage.activeScene()) {
				AppAssistant.helper.verifyAuth(function() {
					Mojo.Controller.stageController.pushScene('main');
				});
			}
		}
	},
	handleCommand: function(event) {}
};

