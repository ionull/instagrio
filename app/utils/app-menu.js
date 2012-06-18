function AppMenu(opts) {
	this.opts = opts;
	this.menus = {
		home: 'home',
		hot: 'hot',
		mine: 'mine',
		liked: 'liked'
		//setting: 'setting'
	}
	this.init();
};

AppMenu.get = function(opts) {
	if (AppMenu.menu == null) {
		AppMenu.menu = new AppMenu(opts);
	}
	return AppMenu.menu;
}

AppMenu.prototype = {
	init: function() {
		this.isShow = false;
		this.observe();
		this.toggggle();
	},
	toggggle: function() {
		var that = this;
		this.navBg = $('nav-bg');
		this.navBg.hide();
		this.baseButton = $('base-button');
		this.circle = $('container-circle');
		this.btns = this.circle.select('[class="btn-toggle"]');
		if (this.btns.length == 0) {
			this.btns = this.circle.select('[class="btn-toggle open"]');
		}
		//toggle button
		this.baseButton.observe('click', function() {
			//that.toggleMenu();
		}.bind(this));
		//buttons listener
		this.btns.each(function(i) { (function(i) {
				i.observe('click', function() {
					//that.onToggleItem(i);
					//that.toggleMenu();
				});
			})(i);
		});

		//nav bg click
		this.navBg.observe('click', function(e) {
			var target = e.target;
			//AppHandler.alert('on nav bg: ' + target.id);
		});
		this.circle.observe('click', function(e) {
			var target = e.target;
			if(!(target.id)) {
				target = target.parentNode;
			}
			if(!(target.id)) {
				target = target.parentNode;
			}
			if(target.id == 'base-button') {
				that.toggleMenu();
			} else {
				that.onToggleItem(target);
			}
		});
	},
	toggleMenu: function() {
		var that = this;
		if (AppMenu.toggled) {
			//hide it
			//that.navBg.removeClassName('open');
			//this.navBg.hide();
			that.baseButton.removeClassName('open');
			that.btns.each(function(i) {
				i.removeClassName('open');
			});
		} else {
			//show it
			//this.navBg.show();
			//that.navBg.addClassName('open');
			that.baseButton.addClassName('open');
			that.btns.each(function(i) {
				i.addClassName('open');
			});
		}
		AppMenu.toggled = ! (AppMenu.toggled);
	},
	keepFolding: function() {
		if(AppMenu.toggled) {
			AppMenu.get().toggleMenu();
		}
	},
	show: function() {
		this.isShow = true;
		$('nav-bar').show();
	},
	hide: function(temply) {
		if (!temply) this.isShow = false;
		$('nav-bar').hide();
	},
	showToggle: function() {
		this.circle.show();
	},
	hideToggle: function() {
		this.circle.hide();
	},
	observe: function() {
		var that = this;

		//onclick listeners
		for (var menu in that.menus) { (function(menu) {
				Mojo.Log.info('observe ' + menu);
				var current = $('nav-' + that.menus[menu]);
				current.observe('click', function() {
					that.onclick(that.menus[menu]);
				}.bind(that));
			})(menu);
		}

		//show or hide
		//this.prevent(window.document);
	},
	onToggleItem: function(which) {
		var id = which.id;
		if(id && id.indexOf('nav-') >= 0) {
			this.toggleMenu();
			this.menuTo(id.replace('nav-', ''));
			AppHandler.alert('pulling..');
		}
	},
	onclick: function(which) {
		Mojo.Log.info('on menu click: ' + which);
		var that = this;
		for (var menu in that.menus) {
			var current = $('nav-' + that.menus[menu]).getElementsBySelector('span')[0];
			//Mojo.Log.info('current menu :' + current.innerHTML);
			if (that.menus[menu] == which) {
				Mojo.Log.info('going to active: ' + which);
				current.addClassName('active');
			} else if (current.hasClassName('active')) {
				Mojo.Log.info('going to remove active: ' + that.menus[menu]);
				current.removeClassName('active');
			}
		}
		switch (which) {
		case 'setting':
			break;
		default:
			that.menuTo(which);
			break;
		}
	},
	menuTo: function(which) {
		var that = this;
		var currentScene = Mojo.Controller.stageController.activeScene();
		Mojo.Log.info('on activate ' + Mojo.Log.propertiesAsString(currentScene.assistant, true));
		var opts = {
			source: 'menu',
			which: which
		};
		if (currentScene != null && currentScene.sceneName == 'main') {
			currentScene.assistant.refresh(opts);
		} else {
			Mojo.Controller.stageController.popScenesTo('main', opts);
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

