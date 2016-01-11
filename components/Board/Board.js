/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
//import s from './Board.scss';

//import s from './Board.css';
//import withStyles from '../../decorators/withStyles';
import CustomEvents from '../CustomEvents/CustomEvents';
import DetailPane from '../DetailPane/DetailPane';
import GpioDivList from '../GpioDivList/GpioDivList';
import $ from 'jquery';

import './Board.css';

/*
 | Our main board. 
 | 
 | Top-level object. Displays the board name, image, divs and detail pane.
 | Needs to have a "board" to work. The "board" can be changed by the BoardSelection component,
 | triggering a redirect. So the "board" is considered state.
 |
 | This follows the pattern Load Initial Data via AJAX : https://facebook.github.io/react/tips/initial-ajax.html

 */
//@withStyles(s)
class Board extends Component {

	constructor(props) {
    	super(props);
    	this.state = {board:null};
  	}

 	componentDidMount() {
 		console.log(" ++ Board - componentDidMount");

 		var component = this;

		CustomEvents.subscribe("Board",CustomEvents.BOARD_SELECTION, function(data) {
			console.log(" ++ Board - RECEIVED BOARD_SELECTION EVENT " + data);
	    
	    	$.get("/boards/" + data.board, function(board) {
	      		component.setState({"board" : board});
	      		console.log("Found board " + board.name);
	    	});

		});

 	}

 	componentWillUnmount() {
 		console.log(" ++ Board - componentWillUnmount");
		CustomEvents.unsubscribe("Board",CustomEvents.BOARD_SELECTION);
 	}

 	render() {
 		console.log(" ++ Board - render");

 		if (this.state.board) {
	 		return (
				<div className="parent">
		 			<div className="board">

			 			<h1>{this.state.board.name}</h1>

			 			<DetailPane/>

			 			<div className="boardcontainer">
				 			<GpioDivList boardConfig={this.state.board}/>
				 			<img src={require(this.state.board.imageUrl)}/>
						</div>
		 			</div>

	 			</div>
	 		);

	 	} else {

	 		return (

	 			<div>
	 			
	 			Select an IoT board from the dropdown box below. An image will be shown representing the board, 
	 			hightliging the available gpios that can be manipulated.

                <img src={require('./images/demo.gif')}/>

	 			</div>);
	 	}
 	}
}

export default Board;