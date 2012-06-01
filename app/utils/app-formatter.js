var AppFormatter = {
    time: function(time, model){
        return AppFormatter.timeSince(parseInt(time) * 1000);
    },
    timeSince: function(time){
        //using a modified Date function in vendors/date.js
        var d = new Date(time);
        return d.toRelativeTime(1500);
    },
    location: function(n, model){
        if (n != null) 
            return n['name'];
        else 
            return '';
    },
	user: function(n, model){
		if(n == null) return '';
		//Mojo.Log.info(this.TAG, 'onUserFormatted ' + Mojo.Log.propertiesAsString(n, true));
		//return 'javascript:AppHandler.onUserClicked(' + n.id + ');';
		var index = AppHandler.photoListHelper.modelList.items.indexOf(model);
		return 'javascript:AppHandler.onUserClicked(' + index + ');';
	},
	user_nolink: function(n, model) {
		return '#';
	},
	likesCount: function(n, model) {
		if(n) {
			var img = '';
			if(model.user_has_liked) {
				img = 'liked';
			} else {
				img = 'unliked';
			}
			var like = '';
			if(n.count > 1) {
				like = n.count + ' likes';
			} else {
				like = n.count + ' like';
			}
			like = "<div class='likeContent " + img + "' data-id='" + model.id + "'/>" + like + "</div>";
			return like;
		} else {
			return '';
		}
	}
};
