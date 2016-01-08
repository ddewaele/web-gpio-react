/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import Gpio from '../Gpio/Gpio';
import $ from 'jquery';
import CustomEvents from '../CustomEvents/CustomEvents';

/*
 | Our detail pane is responsible for rendering a single GPIO definition.
 | 
 | Based on the selected gpio object (define) , a <Gpio> component is rendered.
 |
 */
class DetailPane extends Component {

	constructor(props) {
    	super(props);
    	this.state = {selectedGpio: null};
  	}

 	// We'll be receiving events from the boards gpioList.
 	//
 	// The payload contains the following: 
 	// data.gpioDiv : Object {location: "J6_6_1", pin: "11", gpio: "147", description: "pin 11 inner bank"}
 	componentDidMount() {
 		console.log(" ++ DetailPane - componentDidMount");
 		var that = this;
		CustomEvents.subscribe("DetailPane",CustomEvents.MASTERLISTITEM_SELECTION, function(data) {
			console.log(" ++ DetailPane - RECEIVED MASTERLISTITEM_SELECTION EVENT " + data);
			that.setState({selectedGpio:data.gpioDiv});
		});

 	}

 	componentWillUpdate() {
 		console.log(" ++ DetailPane - componentWillUpdate");
 	}

 	componentDidUpdate(prevProps,prevState) {
 		console.log(" ++ DetailPane - componentDidUpdate");
 	}

 	componentWillUnmount() {
 		console.log(" ++ DetailPane - componentWillUnmount");
		CustomEvents.unsubscribe("DetailPane",CustomEvents.MASTERLISTITEM_SELECTION);
 	}

 	render() {
 		console.log(" ++ DetailPane - render");
 		return (
 			<div>
				{this.state.selectedGpio && 
					<Gpio key={this.state.selectedGpio.pin} pin={this.state.selectedGpio.pin} gpio={this.state.selectedGpio.gpio} description={this.state.selectedGpio.description} />
				}
 			</div>

 		);
 	}

 }

export default DetailPane;