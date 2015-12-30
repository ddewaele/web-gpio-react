var app = window.app || {};

(function () {
	'use strict';

	app.apiPath="/udooneorest";

	app.restApi = {
	
		executeAjaxCall: function(url,method,successCallback,errorCallback) {
	 		console.log(" ++ AJAX : executing HTTP " + method + " with url " + url);
	 		$.ajax({
	 			url: url,
	 			dataType: 'json',
	 			method: method,
	 			cache: false,

	 			success: function(data) {
	 				console.log(" ++ AJAX : call ok with response " + JSON.stringify(data));
	 				typeof successCallback === 'function' && successCallback(data);
				}.bind(this),

				error: function(xhr, status, err) {
					console.log(" ++ AJAX : error occured " + JSON.stringify(xhr));
					typeof errorCallback === 'function' && errorCallback(xhr, status, err);
				}.bind(this)
			});
	 	},

	 	retrieveGpioValue: function(gpio,success,error) {
			var url = app.apiPath + "/gpio/" + gpio + "/value"
	 		
	 		this.executeAjaxCall(
	 			url,
	 			'GET',
	 			success,
	 			error
	 		);

	 	},

	 	retrieveGpioDirection: function(gpio,success,error) {
			var url = app.apiPath + "/gpio/" + gpio + "/direction"
	 		this.executeAjaxCall(
	 			url,
	 			'GET',
	 			success,
	 			error
	 		);
			
	 	},

	 	toggleGpio: function(gpio,val,success,error) {
	 		var url = app.apiPath + "/gpio/" + gpio + "/value/" + (val ? "1"  : "0");
			
			this.executeAjaxCall(
	 			url,
	 			'PUT',
	 			success,
	 			error
	 		);
	 	},	

	 	changeGpioDirection: function(gpio,direction,success,error) {
	 		var url = app.apiPath + "/gpio/" + gpio + "/direction/" + direction;
	 		this.executeAjaxCall(
	 			url,
	 			'PUT', 
	 			success,
	 			error
	 		);
	 	},	 

	 	exportGpio: function(gpio,success,error) {
	 		var url = app.apiPath + "/gpio/" + gpio + "/export";
	 		this.executeAjaxCall(
	 			url,
	 			'POST', 
	 			success,
	 			error
	 		);
	 		
	 	},

	 	unExportGpio: function(gpio,success,error) {

	 		var url = app.apiPath + "/gpio/" + gpio + "/unexport";
	 		this.executeAjaxCall(
	 			url,
	 			'POST', 
	 			success,
	 			error
	 		);
	 		
	 	}
 	}

 	console.log("app restApi created : " + app.restApi);

})();
