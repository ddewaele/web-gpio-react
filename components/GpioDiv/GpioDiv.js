/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
//import s from './GpioDiv.scss';
//import s from './GpioDiv.css';
//import withStyles from '../../decorators/withStyles';
import CustomEvents from '../CustomEvents/CustomEvents';

import './GpioDiv.css';
/*
 | Represents the object responsible for rendering a single GPIO div overlay on top of the image board.
 |
 | Its position is automatically derived from the gpioDiv object.
 | 
 | Supports an onClick event to select the GPIO
 | 
 */
//@withStyles(s)
class GpioDiv extends Component {

	constructor(props) {
    	super(props);
    	this.state = {selectedGpioDiv: null};
  	}


 	//
 	// Here we've clicked on a div. 
 	// This div corresponds with an actual gpio object 	
 	// 
 	//
 	gpioSelected() {
 		if (this.props.gpioDiv.gpio) {
 			CustomEvents.notify(CustomEvents.MASTERLISTITEM_SELECTION, {gpioDiv:this.props.gpioDiv.gpio});
 		} else {
 			console.log("gpio " + this.props.gpioDiv.pin + " disabled")
 		}
 	}

	// When the DIV is rendered on the screen it starts listening for selection events.
	// All DIVs will receive an event telling them what the selected div was.
	// That way,  they can use that state to determine if the div was selected or not.
	//
	// this.props.gpioDiv : Object {pin: "J6_0_0", x: 210, y: 48, gpio: undefined}
	// data.gpioDiv : Object {location: "J6_4_1", pin: "13", gpio: "102", description: "pin 13 inner bank"}
 	componentDidMount() {
		console.log(" ++ GpioDiv - componentDidMount");
 		var that = this;
 		
 		CustomEvents.subscribe("GpioDiv",CustomEvents.MASTERLISTITEM_SELECTION, function(data) {
 			console.log(" ++ GpioDiv - RECEIVED MASTERLISTITEM_SELECTION EVENT " + data);
 			console.log("gpioDiv setting state " + (data.gpioDiv ? data.gpioDiv.pin : ""));
 			//if (that.isMounted()) {
				that.setState({selectedGpioDiv:data.gpioDiv});
			//}
		});

 	}

		//BUG: shows reactJS errors in console when commented.
		//BUG: shows no reactJS errors in console when uncommented but fails to show detail pane
		//BUG : Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the GpioDiv component.
 	componentWillUnmount() {
 		console.log(" ++ GpioDiv - componentWillUnmount");
		CustomEvents.unsubscribe("GpioDiv",CustomEvents.MASTERLISTITEM_SELECTION); 
 	}

 	componentDidUpdate(prevProps,prevState) {
		console.log(" ++ GpioDiv - componentDidUpdate : " + this.isSelected());
 	}

	isSelected() {
		if (!this.state.selectedGpioDiv) return false;
		return this.props.gpioDiv.pin === this.state.selectedGpioDiv.location;
	}

	getBackgroundColor() {
		var backgroundColor;

		if (!this.props.gpioDiv.gpio) {
			return "grey";
		} else {
			if (this.isSelected()) {
				return "red";	
			} else {
				return "green";
			} 
		}

	}

	render() {

		var divStyle = {
			width: "15px",
			height: "15px",
			left: this.props.gpioDiv.x + "px",
			top: this.props.gpioDiv.y + "px",
			backgroundColor: this.getBackgroundColor()
		};

		return (
			<div className="gpioTag" style={divStyle} onClick={this.gpioSelected.bind(this)} />
		);
	}
}

export default GpioDiv;


