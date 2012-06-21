function ConnectAssistant() {
}

ConnectAssistant.prototype.setup = function() {
	var that = this;
	AppMenu.get(this).hideToggle();
	//AppHandler.setAppBackground(this.controller.document, "#A1AC88");
	var oauthConfig={
		callbackScene:'main', //Name of the assistant to be called on the OAuth Success
		authorizeUrl:'http://instagram.com/oauth/authorize',
		accessTokenUrl:'https://api.instagram.com/oauth/access_token',
		accessTokenMethod:'POST', // Optional - 'GET' by default if not specified
		client_id: '09bac026afa04616b295aab9f5bacd59',
		client_secret:'05e28e07955a4de5ad98673df1a46207',//if response_type == token dunt need
		redirect_uri:'http://www.google.com.hk', // Optional - 'oob' by default if not specified
		response_type: 'code',
		scope: ['likes','comments','relationships']
	 };
	 
	this.controller.get('connect_btn').observe('click', function(event) {
		var el = Event.element(event);
		el.setStyle({backgroundPosition: '0 -86px'});
		that.controller.stageController.popScene();
		that.controller.stageController.pushScene('oauth', oauthConfig);
		//AppHandler.setAppBackground(that.controller.document, "#FFFFFF");
	});
};

ConnectAssistant.prototype.activate = function(event) {
};

ConnectAssistant.prototype.deactivate = function(event) {
};

ConnectAssistant.prototype.cleanup = function(event) {
};
