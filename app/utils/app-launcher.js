var AppLauncher = {
	launch: function(action, data, onSuccess, onFailure, method) {
		var params = {
			"action": action,
			"data": data
		};
		if (!action) {
			params = null;
		}
		new Mojo.Service.Request("palm://com.palm.applicationManager", {
			method: method ? method: "open",
			parameters: {
				id: Mojo.appInfo.id,
				params: params
			},
			onSuccess: function(response) {
				if (onSuccess) {
					onSuccess(response);
				}
			},
			onFailure: function(response) {
				if (onFailure) {
					onFailure(response);
				}
			}
		});
	},
	onOpenAPP: function() {
		AppLauncher.launch(null, {});
	}
};

