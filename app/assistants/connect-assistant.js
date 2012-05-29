function ConnectAssistant() {
	AppHandler.setAppBackground("#A1AC88");
}

ConnectAssistant.prototype.setup = function() {
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
	 
	$('connect_btn').observe('click', function(event) {
		var el = Event.element(event);
		el.setStyle({backgroundPosition: '0 -86px'});
		Mojo.Controller.stageController.popScene();
		Mojo.Controller.stageController.pushScene('oauth', oauthConfig);
		AppHandler.setAppBackground("#FFFFFF");
	});
};

ConnectAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ConnectAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ConnectAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
