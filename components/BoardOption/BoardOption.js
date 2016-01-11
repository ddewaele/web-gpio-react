/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';

class BoardOption extends Component {

	constructor(props) {
    	super(props);
    	this.state = {};
  	}

	render() {
		return (
			<option value={this.props.value}>{this.props.label}</option>
		);
	}
}

export default BoardOption;