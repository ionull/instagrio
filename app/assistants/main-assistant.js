var MainAssistant = Class.create(BaseAssistant, (function() {
	var private_fn = {};

	return {
		initialize: function(params) {
			this.TAG = 'MainAssistant';

			if (params != null) {
				this.initParams = params;
				Mojo.Log.info(this.TAG, 'on init' + Mojo.Log.propertiesAsString(params, true));
				if (params.source == 'oauth') {
					var response = params.response.responseJSON;
					if (params.response.status == 200) {
						AppHandler.access_token = response.access_token;
						AppHandler.user = response.user;
						Mojo.Log.info(this.TAG, this.access_token);
						AppDB.saveOAuth(response);
					}
				}
			}
		},
		setup: function($super) {
			Mojo.Log.info(this.TAG, 'setup');
			$super();
			this.floatAll = this.controller.get('float_all');
			this.floatAll.hide();

			var photoListHelper = new PhotoListHelper({
				idList: 'feed-list',
				controller: this.controller,
				linkable: true,
				assistant: this
			});
			this.photoListHelper = photoListHelper;

			this.callback = photoListHelper.callback();

			if(this.initParams == null || this.initParams.source == 'oauth') {
				this.refresh({
					source: 'menu',
					which: 'home'
				});
			} else {
				this.refresh(this.initParams);
			}
		},
		loadMore: function(nextMaxId) {
			Mojo.Log.error('loading more..' + nextMaxId);
			this.refresh({
				source: 'menu',
				which: this.lastWhich,
				nextMaxId: nextMaxId
			});
		},
		refresh: function(opts) {
			if (opts != null) {
				if (opts.source == 'menu') {
					Mojo.Log.info(this.TAG, 'on refresh: ' + opts.which);
					this.lastWhich = opts.which;
					var callback = {
						onSuccess: this.callback.onSuccess.bind(this),
						onFailure: this.callback.onFailure.bind(this),
						nextMaxId: opts.nextMaxId
					};
					if(opts.which == 'liked') {
						callback.isLiked = true;
					}
					switch (opts.which) {
						case 'home':
							AppSDK.getFeed(callback);
						break;
						case 'hot':
							AppSDK.getPopular(callback);
						break;
						case 'mine':
							AppSDK.getMine(callback);
						break;
						case 'liked':
							AppSDK.getUsersSelfMediaLiked(callback);
						break;
						default:
							break;
					}
				}
			}
		},
		activate: function($super, event) {
			Mojo.Log.info(this.TAG, 'on activate ' + Mojo.Log.propertiesAsString(event, true));
			this.refresh(event);
			$super(event);
		},
		deactivate: function($super, event) {
			$super(event);
		},
		cleanup: function($super, event) {
			$super(event);
			Mojo.Log.info(this.TAG, 'cleanup');
		}
	};
})());

