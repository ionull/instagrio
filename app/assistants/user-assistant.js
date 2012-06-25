var UserAssistant = Class.create(BaseAssistant, {
	initialize: function($super, opts) {
		this.TAG = 'UserAssistant';
		Mojo.Log.info(this.TAG, 'initialize');
		$super(opts);
		this.uid = opts.user.id;
		this.opts = opts;
	},
	setup: function($super) {
		$super();
		Mojo.Log.info(this.TAG, 'setup');
		var that = this;

		var userAvatar = this.controller.get('user-avatar');
		userAvatar.src = that.opts.user.profile_picture;
		userAvatar.observe('click', function(e) {
			//TODO show large avatar?
			//AppHandler.alert('on avatar click');
			e.stop();
		});
		var userName = this.controller.get('username');
		userName.innerHTML = that.opts.user.username;
		AppSDK.getUser({
			onSuccess: function(response) {
				Mojo.Log.info('getUser:' + response.responseText)
				var result = response.responseJSON;
				userAvatar.src = result.data.profile_picture;
				if (result.data.full_name != null && result.data.full_name != '') {
					userName.innerHTML = result.data.full_name;
				} else {
					userName.innerHTML = result.data.username;
				}
				if (result.data.counts != null) {
					that.controller.get('counts-po').innerHTML = result.data.counts.media;
					that.controller.get('counts-foed').innerHTML = result.data.counts.followed_by;
					that.controller.get('counts-fo').innerHTML = result.data.counts.follows;
				}
			}.bind(this),
			onFailure: function() {}
		},
		this.uid);

		var btnFollow = this.controller.get('btn-follow');
		if (this.uid == AppHandler.user.id) {
			btnFollow.outerHTML = '<p class="username">Hmmm, that\'s you, a ha!</p>';
		} else {
			btnFollow.observe('click', function() {
				if (btnFollow.innerHTML == 'requesting') {
					AppHandler.alert('requesting');
					return;
				}
				var following = (btnFollow.innerHTML == 'unfollow'); //getAttribute('value')
				AppSDK.postUserRelationship({
					onSuccess: function(result) {
						var json = result.responseJSON;
						if (json.meta.code == 200) {
							switch (json.data.outgoing_status) {
							case AppSDK.RELATION_FOLLOWING:
								btnFollow.innerHTML = 'unfollow';
								AppHandler.alert('follow success!');
								break;
							case AppSDK.RELATION_NONE:
								btnFollow.innerHTML = 'follow';
								AppHandler.alert('unfollow success!');
								break;
							case AppSDK.RELATION_REQUESTED:
								btnFollow.innerHTML = 'requesting';
								AppHandler.alert('request success!');
								break;
							}
						}
					},
					onFailure: function() {
						AppHandler.alert('follow failed!');
					}
				},
				that.uid, following ? AppSDK.ACTION_UNFOLLOW: AppSDK.ACTION_FOLLOW);
				AppHandler.alert('processing');
			});

			AppSDK.getUserRelationship({
				onSuccess: function(response) {
					Mojo.Log.info(response.responseText);
					var result = response.responseJSON;
					var outStatus = result['data']['outgoing_status'];
					if (outStatus == AppSDK.RELATION_FOLLOWING) {
						btnFollow.innerHTML = 'unfollow';
					} else if (outStatus == AppSDK.RELATION_REQUESTED) {
						btnFollow.innerHTML = 'requesting';
					}
				},
				onFailure: function() {}
			},
			this.uid);
		}

		this.countsArea = this.controller.get('counts-area');
		if (this.countsArea) {
			this.countsHandler = function(e) {
				//AppHandler.alert('on counts:' + e.target.id);
				var target = e.target;
				if (target.hasClassName('post')) {
					//
				} else if (target.hasClassName('foed')) {
					that.controller.stageController.pushScene('user-list', 'foed', that.uid);
				} else if (target.hasClassName('foing')) {
					that.controller.stageController.pushScene('user-list', 'foing', that.uid);
				}
			}.bind(this);
			Mojo.Event.listen(this.countsArea, 'click', this.countsHandler);
		}

		var photoListHelper = new PhotoListHelper({
			idList: 'feed-list',
			controller: this.controller,
			linkable: false,
			assistant: this
		});
		this.photoListHelper = photoListHelper;

		this.callback = photoListHelper.callback();
		AppSDK.getUserMedia(this.callback, this.uid);
	},
	activate: function($super) {
		$super();
	},
	deactivate: function($super) {
		$super();
	},
	cleanup: function($super) {
		$super();
		if (this.countsArea) {
			Mojo.Event.stopListening(this.countsArea, 'click', this.countsHandler);
		}
	}
});

