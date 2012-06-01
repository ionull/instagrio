function AppMenu(opts){
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

AppMenu.get = function(opts){
    if (AppMenu.menu == null) {
        AppMenu.menu = new AppMenu(opts);
    }
    return AppMenu.menu;
}

AppMenu.prototype = {
    init: function(){
		this.isShow = false;
        this.observe();
    },
    show: function(){
		this.isShow = true;
        $('nav-bar').show();
    },
    hide: function(temply){
		if(!temply)this.isShow = false;
        $('nav-bar').hide();
    },
	observe: function(){
		var that = this;
		
		//onclick listeners
		for(var menu in that.menus) {
			(function(menu){
				Mojo.Log.info('observe ' + menu);
				var current = $('nav-' + that.menus[menu]);
				current.observe('click', function(){
					that.onclick(that.menus[menu]);
				}.bind(that));
			})(menu);
		}
		
		//show or hide
		//this.prevent(window.document);
	},
    onclick: function(which){
        Mojo.Log.info('on menu click: ' + which);
		var that = this;
		for(var menu in that.menus) {
			var current = $('nav-' + that.menus[menu]).getElementsBySelector('span')[0];
			//Mojo.Log.info('current menu :' + current.innerHTML);
			if(that.menus[menu] == which) {
				Mojo.Log.info('going to active: ' + which);
				current.addClassName('active');
			} else if(current.hasClassName('active')) {
				Mojo.Log.info('going to remove active: ' + that.menus[menu]);
				current.removeClassName('active');
			}
		}
		switch(which) {
			case 'setting':
				break;
			default:
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
				break;
				break;
		}
    },
    prevent: function(who){
		if(who == null) return;
		//Mojo.Log.info('prevent: ' + who.outerHTML);
		var that = this;
		who.observe('keyup', who.handlerKeyUp = function(e){
			var keyCode = e.keyCode;
			Mojo.Log.info('onkeyup: ' + keyCode);
			if(keyCode == 57575 || keyCode == 27) {
				//Mojo.Log.info('keyup event:' + Mojo.Log.propertiesAsString(e, true));
				var currentScene = Mojo.Controller.stageController.activeScene();
				if(currentScene.sceneName == 'main') {
					if(that.isShow) {
						that.hide();
					} else {
						that.show();
					}
					e.stop();
				} else {
					if(that.isShow) {
						that.hide();
						e.stop();
					}
				}
			}
		});
    },
	dePrevent: function(who) {
		if(who == null) return;
		//Mojo.Log.info('dePrevent', who.handlerKeyUp);
		who.stopObserving('keyup', who.handlerKeyUp);
	}
}
