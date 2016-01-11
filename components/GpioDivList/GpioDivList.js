/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import CustomEvents from '../CustomEvents/CustomEvents';
import GpioDiv from '../GpioDiv/GpioDiv';
/*
 |
 | Represents the container object that renders a list of GpioDiv objects.
 | 
 */
class GpioDivList extends Component {

	constructor(props) {
    	super(props);
    	this.state = {selectedGpioDiv: null};
  	}

 	componentDidMount() {
		console.log(" ++ GpioDivList - componentDidMount");
 		var that = this;
		CustomEvents.subscribe("GpioDivList",CustomEvents.MASTERLISTITEM_SELECTION, function(data) {
			console.log(" ++ GpioDivList - RECEIVED MASTERLISTITEM_SELECTION EVENT " + data);
			that.setState({selectedgpioDiv:data.gpioDiv});
		});

 	}

 	componentWillUnmount() {
 		console.log(" ++ GpioDivList - componentWillUnmount");
		CustomEvents.unsubscribe("GpioDivList",CustomEvents.MASTERLISTITEM_SELECTION);
 	}  	

 	// Here we are constructing gpioDiv objects. 
 	// These are POJOs used to render the actual <GpioDiv> components
 	constructGpioDivs() {

 		var gpioHeaders = this.props.boardConfig.headers;


 		var gpios = this.props.boardConfig.gpios;
 		var gpioArrayLength = gpios.length;
 		
 		var gpioMap = {};

		
 		for (var g = 0; g < gpioArrayLength; g++) { // for each gpio
 			gpioMap[gpios[g].location] = gpios[g];
 		}

 		var arrayLength = gpioHeaders.length;

 		var gpioDivs = [];

 		for (var i = 0; i < arrayLength; i++) { // for each header

 			var header = gpioHeaders[i];
 			var beginX = header.xyCoords[0];
 			var beginY = header.xyCoords[1];

 			for (var j = 0; j < header.rows ; j++) { // for each row
 				for (var k = 0; k < header.cols ; k++) { // for each column

 					var pin = header.name + "_" + j + "_" + k;
 					gpioDivs.push({
 						"pin":pin,
 						"x":beginX + (j * header.spaceX),
 						"y":beginY + (k * header.spaceY),
 						"gpio":gpioMap[pin]
 					})
 				}

 			}
 		}


 		return gpioDivs;

 	}

	render() {
		var that = this;
		var divNodes = this.constructGpioDivs().map(function(gpioDiv) {

			return (
				<GpioDiv key={gpioDiv.pin} gpioDiv={gpioDiv} />
			);

		});

		return (
			<div>
			{divNodes}
			</div>
		);
	}
}

export default GpioDivList;