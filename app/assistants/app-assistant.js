function AppAssistant() {};

AppAssistant.helper = {
	verifyAuth: function(onSuccess, stageController) {
		AppDB.getOAuth({
			onSuccess: function(result) {
				AppHandler.access_token = result.access_token;
				AppHandler.user = result.user;
				onSuccess();
			},
			onFailure: function() {
				stageController.pushScene('connect');
			}
		});
	},
	menu: function(controller) {
		var menuItems = [
		Mojo.Menu.editItem,
		/*{
			label: $L(StringMap.menu.runBackground),
			icon: Global.configs.background ? 'toggle-on': 'toggle-off',
			command: 'cmdToggleBackground'
		},
		*/
		{
			label: 'Log out!',
			command: 'cmd-logout'
		}];

		if (AppAssistant.menuModels) {
			AppAssistant.menuModels.items = menuItems;
		} else {
			AppAssistant.menuModels = {
				visible: true,
				items: menuItems
			};
		}
		controller.setupWidget(Mojo.Menu.appMenu, {
			omitDefaultItems: true
		},
		AppAssistant.menuModels);
	}
};

AppAssistant.prototype = {
	setup: function() {},
	handleLaunch: function(launchParams) {
		var that = this;
		Mojo.Log.error('handleLaunch: ' + JSON.stringify(launchParams));

		var appController = Mojo.Controller.getAppController();
		if (launchParams && (launchParams.dockMode || launchParams.touchstoneMode)) {
			//create dock stage
			var dockStage = this.controller.getStageController('dock');

			if (dockStage) {
				dockStage.window.focus();
			} else {
				var f = function(stageController) {
					AppAssistant.helper.verifyAuth(function() {
						stageController.pushScene('photo-gallery', 'dock-mode');
					},
					stageController);
				}.bind(this);
				this.controller.createStageWithCallback({
					name: 'dock',
					lightweight: true
				},
				f, "dockMode");
			}
		} else {
			var mainController = this.controller.getStageProxy('main');
			//create main stage
			var f = function(stageController) {
				//AppHandler.alert('launch main');
				Mojo.Log.error('launch main: ' + JSON.stringify(launchParams));
				AppAssistant.helper.verifyAuth(function() {
					that.onMainLaunch(launchParams, stageController);
				},
				stageController);
			};
			if (mainController) {
				AppAssistant.helper.verifyAuth(function() {
					that.onMainLaunch(launchParams, mainController);
				},
				mainController);
			} else {
				AppMenu.menu = null;
				this.controller.createStageWithCallback({
					name: 'main',
					lightweight: true
				},
				f);
			}
		}
	},
	onMainLaunch: function(launchParams, mainController) {
		if (launchParams) {
			switch (launchParams.action) {
			case 'search-user':
				AppAssistant.helper.verifyAuth(function() {
					//search and get list
					mainController.pushScene('user-list', 'search', launchParams.data);
				});
				break;
			case 'dock-mode':
				AppAssistant.helper.verifyAuth(function() {
					mainController.pushScene('photo-gallery', 'dock-mode');
				});
			default:
				break;
			}
		} else {
			if (mainController) {
				mainController.popScenesTo('main');
				var curr = mainController.activeScene();
				if (!curr || curr.sceneName != 'main') {
					AppAssistant.helper.verifyAuth(function() {
						//AppHandler.alert('push main');
						mainController.pushScene('main');
					});
				}
			}
		}
	},
	clearDock: function() {
		this.clearStage('dock');
	},
	clearMain: function() {
		this.clearStage('main');
	},
	clearStage: function(stageName) {
		var appController = Mojo.Controller.getAppController();
		appController.closeStage(stageName);
	},
	handleCommand: function(event) {
		var that = this;
		var stage = this.controller.getActiveStageController();
		if (event.command == 'cmd-logout') {
			AppDB.removeOAuth({
				onSuccess: function() {
					AppHandler.access_token = null;
					AppHandler.user = null;
					//launch app to show login
					setTimeout(function() {
						Mojo.Log.error('reopen app to connect');
						AppLauncher.onOpenAPP();
					}, 10);
					that.clearMain();
					that.clearDock();
				},
				onFailure: function() {
				}
			});
		}
	}
};

