var UserAssistant = Class.create(BaseAssistant, {
	initialize: function($super, opts) {
		this.TAG = 'UserAssistant';
		Mojo.Log.info(this.TAG, 'initialize');
		$super(opts);
		this.uid = opts.user.id;
		this.opts = opts;
	},
	setup: function() {
		Mojo.Log.info(this.TAG, 'setup');
		var that = this;

		$('user-avatar').src = that.opts.user.profile_picture;
		$('username').innerHTML = that.opts.user.username;
		AppSDK.getUser({
			onSuccess: function(response) {
				Mojo.Log.info('getUser:' + response.responseText)
				var result = response.responseJSON;
				$('user-avatar').src = result.data.profile_picture;
				if (result.data.full_name != null && result.data.full_name != '') {
					$('username').innerHTML = result.data.full_name;
				} else {
					$('username').innerHTML = result.data.username;
				}
				if (result.data.counts != null) {
					$('counts-po').innerHTML = ' :' + result.data.counts.media;
					$('counts-foed').innerHTML = ' :' + result.data.counts.followed_by;
					$('counts-fo').innerHTML = ' :' + result.data.counts.follows;
				}
			}.bind(this),
			onFailure: function() {

			}
		},
		this.uid);

		var btnFollow = $('btn-follow');
		if (this.uid == AppHandler.user.id) {
			btnFollow.outerHTML = '<p class="username">Hmmm, that\'s you, a ha!</p>';
		} else {
			btnFollow.observe('click', function() {
				if(btnFollow.innerHTML == 'requesting') {
					AppHandler.alert('requesting');
					return;
				}
				var following = (btnFollow.innerHTML == 'unfollow'); //getAttribute('value')
				AppSDK.postUserRelationship({
					onSuccess: function(result) {
						var json = result.responseJSON;
						if (json.meta.code == 200) {
							switch(json.data.outgoing_status) {
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
					} else if(outStatus == AppSDK.RELATION_REQUESTED) {
						btnFollow.innerHTML = 'requesting';
					}
				},
				onFailure: function() {}
			},
			this.uid);
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
	activate: function() {
		if (AppMenu.get().isShow) AppMenu.get().hide(true);
	}
});

