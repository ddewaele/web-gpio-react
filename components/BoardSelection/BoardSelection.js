/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import BoardOption from '../BoardOption/BoardOption';
import Board from '../Board/Board';
import CustomEvents from '../CustomEvents/CustomEvents';

const text = 'Board selection component';

class BoardSelection extends Component {

	constructor(props) {
    	super(props);
    	this.state = {};
  	}

    componentDidMount() {

		console.log(" ++ BoardSelection - componentDidMount");
    	var component = this;
    	
    	$.get("/boards", function(boards) {
    		console.log(" ++ BoardSelection - getting new data");
      		component.setState({
      			"boards":boards.boards,
      		});
      		console.log("state set");
    	});

     } 	

     change(event) {
		console.log(" ++ BoardSelection - change ... sending event");
		this.setState({selectedBoard: event.target.value});
         if (event.target.value!=="select") {
         	console.log("About to notify " + CustomEvents.BOARD_SELECTION);
            CustomEvents.notify(CustomEvents.BOARD_SELECTION, {board:event.target.value});
        }
     }


     render(){
     	console.log(" ++ BoardSelection - render");
     	if (this.state.boards) {

	    	var boardOptions = this.state.boards.map(function(boardOption) {
	 			return (
	 				<BoardOption key={boardOption.name} value={boardOption.name} label={boardOption.name} />
	 			);
	 		});

	        var selection = (
	           <div>
	           <div className="input-group">
	  				<span className="input-group-addon" id="sizing-addon2">Select a board</span>
	               <select id="lang" className="form-control" onChange={this.change.bind(this)} value={this.state.selectedBoard} aria-describedby="sizing-addon2">
	                  <option value="select">Select</option>
				        {boardOptions}
	               </select>
	            </div>
	                <Board boardName={this.state.selectedBoard} />
	           </div>
	        );

	        return selection;

	    } else {

	    	return (<div>"Loading boards...."</div>);
	    }
     }     

}

export default BoardSelection;
