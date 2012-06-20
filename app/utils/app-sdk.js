function AppSDK() {
	//
};

AppSDK.TAG = 'AppSDK';
AppSDK.api_base = 'https://api.instagram.com/v1';

AppSDK.loadReq = function(callback, url, urlParams, postParams) {
	var method = "get";
	url = AppSDK.api_base + url;
	
	if(urlParams != null) {
		if(urlParams['method'] != null) method = urlParams['method'];
		
		for(var urlName in urlParams) {
			//Mojo.Log.info(AppSDK.TAG, "urlParams " + urlName + " url " + url);
			if(!AppSDK.inFilter(urlName)) 
				url = AppSDK.addUriParam(url, urlName, urlParams[urlName]);
			//Mojo.Log.info(AppSDK.TAG, "after " + url);
		}
		
		if(AppHandler.access_token != null) {
			url = AppSDK.addUriParam(url, 'access_token', AppHandler.access_token);
		}
		
		/*
		if(method == 'put' || method == 'delete') {
			url = AppSDK.addUriParam(url, 'method', method);
			method = 'post';
		}
		*/
	}
	
	Mojo.Log.info(AppSDK.TAG, "method " + method + " url " + url);
	
	if(postParams != null) {
//		for(var postName in postParams) {
//			Mojo.Log.info(AppSDK.TAG, postName + " " + postParams[postName]);
//		}
		postParams['access_token'] = AppHandler.access_token;
	}
	
	var postBody = '';
    for (var name in postParams) {
        if (postBody == '') {
            postBody = name + '=' + postParams[name];
        }
        else {
            postBody = postBody + '&' + name + '=' + postParams[name];
        }
    }
	
	var request = new Ajax.Request(url, {
        method: method,
        //evalJSON: 'force',
//		postBody: JSON.stringify(postParams),
		postBody: postBody,
		//contentType: "application/json",
        onSuccess: (function(transport){
			Mojo.Log.info(AppSDK.TAG, 'onSuccess');// + transport.responseText);
			AppHandler.onSuccess(callback, transport, {
				url: url,
				urlParams: urlParams,
				postParams: postParams
			});
			//AppSDK.onSuccess(callback, transport);
		}),
        onFailure: (function(transport){
			Mojo.Log.info(AppSDK.TAG, 'onFailure' + transport.responseText);
			AppHandler.onFailure(callback, transport, {
				url: url,
				urlParams: urlParams,
				postParams: postParams
			});
			//AppSDK.onFailure(callback, transport);
		})
    });
};

AppSDK.addUriParam = function(uri, name, value) {
	if(value != null) {
		var hasParam = (uri.indexOf("?") != -1);
		return uri + (hasParam ? "&" : "?") + name + "=" + value;
	} else {
		return uri;
	}
};

AppSDK.inFilter = function(name) {
	var result = false;
	var filter = ['method', 'doing', 'upload_id'];
	if(filter.indexOf(name) >= 0) {
		result = true;
	}
	return result;
};

AppSDK.getUser = function(callback, uid) {
	var url = '/users/' + uid;
	
	var urlParams = {
		'method': 'get',
		'doing': 'getUser'
	};
	
	AppSDK.loadReq(callback, url, urlParams);
}

AppSDK.getFeed = function(callback) {
	var url = '/users/self/feed';
	
	var urlParams = {
		'method': 'get',
		'doing': 'getFeed'
	};
	
	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getPopular = function(callback) {
	var url = '/media/popular';
	
	var urlParams = {
		'method': 'get',
		'doing': 'getPopular'
	};
	
	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getUserMedia = function(callback, uid) {
	var url = '/users/' + uid + '/media/recent';
	
	var urlParams = {
		'method': 'get',
		'doing': 'getUserMedia'
	};
	
	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getMine = function(callback) {
	AppSDK.getUserMedia(callback, 'self');
};

AppSDK.getUsersSelfMediaLiked = function(callback) {
	var url = '/users/' + 'self' + '/media/liked';
	
	var urlParams = {
		'method': 'get',
		'doing': 'getUsersSelfMediaLiked'
	};
	
	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getUserRelationship = function(callback, uid) {
	var url = '/users/' + uid + '/relationship';
	
	var urlParams = {
		'method': 'get',
		'doing': 'getUserRelationship'
	};
	
	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.ACTION_FOLLOW = 'follow';
AppSDK.ACTION_UNFOLLOW = 'unfollow';
AppSDK.ACTION_BLOCK = 'block';
AppSDK.ACTION_UNBLOCK = 'unblock';
AppSDK.ACTION_APPROVE = 'approve';
AppSDK.ACTION_DENY = 'deny';

AppSDK.RELATION_NONE = 'none';
AppSDK.RELATION_FOLLOWING = 'follows';
AppSDK.RELATION_REQUESTED = 'requested';
//AppSDK.RELATION_FOLLOWED = ''

AppSDK.postUserRelationship = function(callback, uid, action) {
	var url = '/users/' + uid + '/relationship';
	
	var urlParams = {
		'method': 'post',
		'doing': 'postUserRelationship'
	};
	
	var postParams = {
		action: action
	};
	
	AppSDK.loadReq(callback, url, urlParams, postParams);
};

AppSDK.postMediaLikes = function(callback, media) {
	var url = '/media/' + media + '/likes';
	
	var urlParams = {
		'method': 'post',
		'doing': 'postMediaLikes'
	};
	
	var postParams = {
	};
	
	AppSDK.loadReq(callback, url, urlParams, postParams);
};

AppSDK.delMediaLikes = function(callback, media) {
	var url = '/media/' + media + '/likes';
	
	var urlParams = {
		'method': 'delete',
		'doing': 'delMediaLikes'
	};
	
	var postParams = {
	};
	
	AppSDK.loadReq(callback, url, urlParams, postParams);
};

AppSDK.getMediaLikes = function(callback, media) {
	var url = '/media/' + media + '/likes';

	var urlParams = {
		'method': 'get',
		'doing': 'getMediaLikes'
	}

	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.postMediaComments = function(callback, media, comment) {
	var url = '/media/' + media + '/comments';

	var urlParams = {
		'method': 'post',
		'doing': 'postMediaComments'
	};

	var postParams = {
		text: comment
	};

	AppSDK.loadReq(callback, url, urlParams, postParams);
};

AppSDK.getMediaComments = function(callback, media) {
	var url = '/media/' + media + '/comments';

	var urlParams = {
		'method': 'get',
		'doing': 'getMediaComments'
	};

	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getMediaSearch = function(callback, lat, lng) {
	var url = '/media/search';

	var urlParams = {
		'method': 'get',
		'doing': 'getMediaSearch',
		'lat': lat,
		'lng': lng
	}

	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getLocationsSearch = function(callback, lat, lng, distance) {
	if(!distance) {
		distance = 5000;
	}
	var url = '/locations/search';

	var urlParams = {
		'method': 'get',
		'doing': 'getLocationsSearch',
		'lat': lat,
		'lng': lng,
		'distance': distance
	}

	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getUsersFollows = function(callback, who) {
	var url = '/users/' + who + '/follows';

	var urlParams = {
		'method': 'get',
		'doing': 'getUsersFollows'
	}

	AppSDK.loadReq(callback, url, urlParams);
};

AppSDK.getUsersFollowedBy = function(callback, who) {
	var url = '/users/' + who + '/followed-by';

	var urlParams = {
		'method': 'get',
		'doing': 'getUsersFollowedBy'
	}

	AppSDK.loadReq(callback, url, urlParams);
};
