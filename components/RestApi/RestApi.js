/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

class RestApi {

	constructor(properties) {
    	this.properties = properties;
  	}

	executeAjaxCall(url,method,successCallback,errorCallback) {
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
 	}

 	retrieveGpioValue(gpio,success,error) {
		var url = this.properties.apiPath + "/gpio/" + gpio + "/value"
 		
 		this.executeAjaxCall(
 			url,
 			'GET',
 			success,
 			error
 		);

 	}

 	retrieveGpioDirection(gpio,success,error) {
		var url = this.properties.apiPath + "/gpio/" + gpio + "/direction"
 		this.executeAjaxCall(
 			url,
 			'GET',
 			success,
 			error
 		);
		
 	}

 	toggleGpio(gpio,val,success,error) {
 		var url = this.properties.apiPath + "/gpio/" + gpio + "/value/" + (val ? "1"  : "0");
		
		this.executeAjaxCall(
 			url,
 			'PUT',
 			success,
 			error
 		);
 	}

 	changeGpioDirection(gpio,direction,success,error) {
 		var url = this.properties.apiPath + "/gpio/" + gpio + "/direction/" + direction;
 		this.executeAjaxCall(
 			url,
 			'PUT', 
 			success,
 			error
 		);
 	}

 	exportGpio(gpio,success,error) {
 		var url = this.properties.apiPath + "/gpio/" + gpio + "/export";
 		this.executeAjaxCall(
 			url,
 			'POST', 
 			success,
 			error
 		);
 		
 	}

 	unExportGpio(gpio,success,error) {

 		var url = this.properties.apiPath + "/gpio/" + gpio + "/unexport";
 		this.executeAjaxCall(
 			url,
 			'POST', 
 			success,
 			error
 		);
 		
 	}


}

//export default RestApi;
export default new RestApi({apiPath:"https://web-gpio-react.herokuapp.com/"});