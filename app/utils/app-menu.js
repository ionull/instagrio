function AppMenu(opts) {
	this.opts = opts;
	this.init();
};

AppMenu.get = function(opts) {
	if (AppMenu.menu == null) {
		//Mojo.Log.error('creating menu');
		AppMenu.menu = new AppMenu(opts);
	} else {
		if(opts && opts.controller) {
			//Mojo.Log.error('replacing menu');
			AppMenu.menu.opts = opts;
		}
	}
	return AppMenu.menu;
}

AppMenu.prototype = {
	init: function() {
		this.isShow = false;
		this.toggggle();
	},
	toggggle: function() {
		var that = this;
		this.baseButton = this.opts.controller.get('base-button');
		this.circle = this.opts.controller.get('container-circle');
		this.btns = this.circle.select('[class="btn-toggle"]');
		if (this.btns.length == 0) {
			this.btns = this.circle.select('[class="btn-toggle open"]');
		}

		//nav bg click
		/*
		this.circle.observe('click', function(e) {
			var target = e.target;
			Mojo.Log.error('onCircleClick: ' + target.outerHTML);
			if (! (target.id)) {
				target = target.parentNode;
			}
			if (! (target.id)) {
				target = target.parentNode;
			}
			if (target.id == 'base-button') {
				//that.toggleMenu();
			} else {
				that.onToggleItem(target);
			}
		});
		*/
	},
	toggleMenu: function() {
		var that = this;
		if (AppMenu.toggled) {
			//hide it
			that.baseButton.removeClassName('open');
			that.btns.each(function(i) {
				i.removeClassName('open');
			});
		} else {
			//show it
			that.baseButton.addClassName('open');
			that.btns.each(function(i) {
				i.addClassName('open');
			});
		}
		AppMenu.toggled = ! (AppMenu.toggled);
	},
	keepFolding: function() {
		if (AppMenu.toggled) {
			AppMenu.get().toggleMenu();
		}
	},
	show: function() {
		this.isShow = true;
	},
	hide: function(temply) {
		if (!temply) this.isShow = false;
	},
	showToggle: function() {
		this.circle.show();
	},
	hideToggle: function() {
		this.circle.hide();
	},
	onToggleItem: function(which) {
		var id = which.id;
		if (id && id.indexOf('nav-') >= 0) {
			//this.toggleMenu();
			this.menuTo(id.replace('nav-', ''));
		}
	},
	menuTo: function(which) {
		Mojo.Log.error('menu to: ' + which);
		AppHandler.alert('pulling..');
		var that = this;
		var mainStage = Mojo.Controller.getAppController().getStageController('main');
		if (mainStage) {
			//var currentScene = Mojo.Controller.stageController.activeScene();
			var currentScene = mainStage.activeScene();
			//Mojo.Log.info('on activate ' + Mojo.Log.propertiesAsString(currentScene.assistant, true));
			var opts = {
				source: 'menu',
				which: which
			};
			if (currentScene != null && currentScene.sceneName == 'main') {
				currentScene.assistant.refresh(opts);
			} else {
				//Mojo.Controller.stageController.popScenesTo('main', opts);
				mainStage.popScenesTo('main', opts);
				currentScene = mainStage.activeScene();
				if (!currentScene || currentScene.sceneName != 'main') {
					mainStage.pushScene('main');
				}
			}
		}
	},
	prevent: function(who) {
		return;
		if (who == null) return;
		//Mojo.Log.info('prevent: ' + who.outerHTML);
		var that = this;
		who.observe('keyup', who.handlerKeyUp = function(e) {
			var keyCode = e.keyCode;
			if (AppMenu.noSwitch) {
				return;
			}
			Mojo.Log.info('onkeyup: ' + keyCode);
			if (keyCode == 57575 || keyCode == 27) {
				//Mojo.Log.info('keyup event:' + Mojo.Log.propertiesAsString(e, true));
				var currentScene = Mojo.Controller.stageController.activeScene();
				if (currentScene.sceneName == 'main') {
					if (that.isShow) {
						that.hide();
					} else {
						that.show();
					}
					e.stop();
				} else {
					if (that.isShow) {
						that.hide();
						e.stop();
					}
				}
			}
		});
	},
	dePrevent: function(who) {
		if (who == null) return;
		//Mojo.Log.info('dePrevent', who.handlerKeyUp);
		who.stopObserving('keyup', who.handlerKeyUp);
	}
}

