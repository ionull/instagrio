var UserAssistant = Class.create(BaseAssistant, {
    initialize: function($super, opts){
        this.TAG = 'UserAssistant';
        Mojo.Log.info(this.TAG, 'initialize');
        $super(opts);
        this.uid = opts.user.id;
		this.opts = opts;
    },
    setup: function(){
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
				if(result.data.counts != null) {
					$('counts-po').innerHTML = ' :' + result.data.counts.media;
					$('counts-foed').innerHTML = ' :' + result.data.counts.followed_by;
					$('counts-fo').innerHTML = ' :' + result.data.counts.follows;
				}
			}.bind(this),
			onFailure: function() {
				
			}
		}, this.uid);
		
		if(this.uid == AppHandler.user.id) {
			$('btn-follow').outerHTML = '<p class="username">Hmmm, that\'s you, a ha!</p>';
		} else {
			$('btn-follow').observe('click', function(){
				var following = ($('btn-follow').innerHTML == 'unfollow');//getAttribute('value')
				
	            AppSDK.postUserRelationship({
	                onSuccess: function(){
						if(following) {
							$('btn-follow').innerHTML = 'follow';
							AppHandler.alert('unfollow success!');
						} else {
							$('btn-follow').innerHTML = 'unfollow';
							AppHandler.alert('follow success!');
						}
	                },
	                onFailure: function(){
	                    AppHandler.alert('follow failed!');
	                }
	            }, that.uid, following ? AppSDK.ACTION_UNFOLLOW : AppSDK.ACTION_FOLLOW);
	        });
			
			AppSDK.getUserRelationship({
				onSuccess: function(response) {
					Mojo.Log.info(response.responseText);
					var result = response.responseJSON;
					if(result['data']['outgoing_status'] == AppSDK.RELATION_FOLLOWING) {
						$('btn-follow').innerHTML = 'unfollow';
					}
				},
				onFailure: function(){}
			}, this.uid);
		}
		
		var photoListHelper = new PhotoListHelper({
			idList: 'feed-list',
			controller: this.controller,
			linkable: false
		});
        
        this.callback = photoListHelper.callback();
		AppSDK.getUserMedia(this.callback, this.uid);
    },
	activate: function(){
		if(AppMenu.get().isShow) AppMenu.get().hide(true);
	}
});
