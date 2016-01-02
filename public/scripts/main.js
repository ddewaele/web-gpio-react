var app = window.app || {};  // for some reason this doens't work with var app = app || {}. Needs to be on window for jspx files.

(function () {
	'use strict';

	console.log("Main  found restApi " + app.restApi);

 const MASTERLISTITEM_SELECTION = "masterListItemSelection";
 const BOARD_SELECTION = "BoardSelection"; 


/*
 | Our main board. 
 | 
 | Top-level object. Displays the board name, image, divs and detail pane.
 | Needs to have a "board" to work. The "board" can be changed by the BoardSelection component,
 | triggering a redirect. So the "board" is considered state.
 |
 | This follows the pattern Load Initial Data via AJAX : https://facebook.github.io/react/tips/initial-ajax.html

 */
 var Board = React.createClass({

 	getInitialState: function() {
 		return {board:null};
 	},

 	componentDidMount: function() {
 		console.log(" ++ Board - componentDidMount");
 		var component = this;

		CustomEvents.subscribe("Board",BOARD_SELECTION, function(data) {
			console.log(" ++ Board - RECEIVED BOARD_SELECTION EVENT " + data);
	    
	    	$.get("/boards/" + data.board, function(board) {
	      		component.setState({"board" : board});
	      		console.log("Found board " + board.name);
	    	});

		});

 	},

 	componentWillUnmount: function() {
 		console.log(" ++ Board - componentWillUnmount");
		CustomEvents.unsubscribe("Board",BOARD_SELECTION);
 	},  	

 	render: function() {
 		console.log(" ++ Board - render");

 		if (this.state.board) {
	 		return (
				<div className="parent">
		 			<div className="board">

			 			<h1>{this.state.board.name}</h1>

			 			<DetailPane/>

			 			<div className="boardcontainer">
				 			<GpioDivList boardConfig={this.state.board}/>
				 			<img src={this.state.board.imageUrl}/>
						</div>
		 			</div>

	 			</div>
	 		);

	 	} else {

	 		return (
	 			<div>

	 			Select an IoT board from the dropdown box below. An image will be shown representing the board, 
	 			hightliging the available gpios that can be manipulated.

                <img src="images/demo.gif"/>

	 			</div>);
	 	}
 	}
 });


var BoardSelection = React.createClass({


 	getInitialState: function() {
 		return {};
 	},
     
     // Keep in mind that this is called after the render function.
     // Also, when doing the async ajax call, the rendering is still going on ....
     // Also, each call to setState triggers the render function
     componentDidMount: function() {

		console.log(" ++ BoardSelection - componentDidMount");
    	var component = this;
    	
    	$.get("/boards", function(boards) {
    		console.log(" ++ BoardSelection - getting new data");
      		component.setState({
      			"boards":boards.boards,
      		});
      		console.log("state set");
    	});

     },

     change: function(event){
		console.log(" ++ BoardSelection - change ... sending event");
         this.setState({selectedBoard: event.target.value});
         if (event.target.value!=="select") {
            CustomEvents.notify(BOARD_SELECTION, {board:event.target.value});
        }
     },

     render: function(){
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
	               <select id="lang" className="form-control" onChange={this.change} value={this.state.selectedBoard} aria-describedby="sizing-addon2">
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


});

var BoardOption = React.createClass({
	render: function() {
		return (
			<option value={this.props.value}>{this.props.label}</option>
		);
	}
});
/*
 | Our detail pane is responsible for rendering a single GPIO definition.
 | 
 | Based on the selected gpio object (define) , a <Gpio> component is rendered.
 |
 */
 var DetailPane = React.createClass({

 	getInitialState: function() {
 		return {selectedGpio: null};
 	},


 	// We'll be receiving events from the boards gpioList.
 	//
 	// The payload contains the following: 
 	// data.gpioDiv : Object {location: "J6_6_1", pin: "11", gpio: "147", description: "pin 11 inner bank"}
 	componentDidMount: function() {
 		console.log(" ++ DetailPane - componentDidMount");
 		var that = this;
		CustomEvents.subscribe("DetailPane",MASTERLISTITEM_SELECTION, function(data) {
			console.log(" ++ DetailPane - RECEIVED MASTERLISTITEM_SELECTION EVENT " + data);
			that.setState({selectedGpio:data.gpioDiv});
		});

 	},

 	componentWillUpdate: function() {
 		console.log(" ++ DetailPane - componentWillUpdate");
 	},

 	//
 	//
 	// Perhaps a weird hook to use, but the detail pane gets updated each time a gpioDiv was clicked.
 	// So at this point we expect to show the dialog.
 	//
 	// However, when the combo box changes (onChange event), it also triggers a component update. 
 	// In this case however, the selectedGpio will still be the same. 
 	// So only show the modal when we select a new gpio.
 	//
 	// IMPROVEMENT : removed the call to show the modal. not needed here.
 	//
 	componentDidUpdate: function(prevProps,prevState) {
 		console.log(" ++ DetailPane - componentDidUpdate");
 		// if (this.state.selectedGpio!=prevState.selectedGpio) {
	 	// 	console.log("Showing gpioDetailModal " + $('#gpioDetailModal'));
	 	// 	//$('#gpioDetailModal').modal('show');
	 	// }
 	},

 	componentWillUnmount: function() {
 		console.log(" ++ DetailPane - componentWillUnmount");
		CustomEvents.unsubscribe("DetailPane",MASTERLISTITEM_SELECTION);
 	},  	

 	render: function() {
 		console.log(" ++ DetailPane - render");
 		return (
 			<div>
				{this.state.selectedGpio && 
					<Gpio key={this.state.selectedGpio.pin} pin={this.state.selectedGpio.pin} gpio={this.state.selectedGpio.gpio} description={this.state.selectedGpio.description} />
				}
 			</div>

 		);
 	}

 });


/*
 |
 | Represents the container object that renders a list of GpioDiv objects.
 | 
 */
 var GpioDivList = React.createClass({


 	getInitialState: function() {
 		return {selectedGpioDiv: null};
 	},

 	componentDidMount: function() {
		console.log(" ++ GpioDivList - componentDidMount");
 		var that = this;
		CustomEvents.subscribe("GpioDivList",MASTERLISTITEM_SELECTION, function(data) {
			console.log(" ++ GpioDivList - RECEIVED MASTERLISTITEM_SELECTION EVENT " + data);
			that.setState({selectedgpioDiv:data.gpioDiv});
		});

 	},

 	componentWillUnmount: function() {
 		console.log(" ++ GpioDivList - componentWillUnmount");
		CustomEvents.unsubscribe("GpioDivList",MASTERLISTITEM_SELECTION);
 	},  	

 	// Here we are constructing gpioDiv objects. 
 	// These are POJOs used to render the actual <GpioDiv> components
 	constructGpioDivs: function() {

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

 	},

	render: function() {
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


});


/*
 | Represents the object responsible for rendering a single GPIO div overlay on top of the image board.
 |
 | Its position is automatically derived from the gpioDiv object.
 | 
 | Supports an onClick event to select the GPIO
 | 
 */
 var GpioDiv = React.createClass({

 	getInitialState: function() {
 		return {selectedGpioDiv: null};
 	},

 	//
 	// Here we've clicked on a div. 
 	// This div corresponds with an actual gpio object 	
 	// 
 	//
 	gpioSelected: function() {
 		if (this.props.gpioDiv.gpio) {
 			CustomEvents.notify(MASTERLISTITEM_SELECTION, {gpioDiv:this.props.gpioDiv.gpio});
 		} else {
 			console.log("gpio " + this.props.gpioDiv.pin + " disabled")
 		}
 	},

	// When the DIV is rendered on the screen it starts listening for selection events.
	// All DIVs will receive an event telling them what the selected div was.
	// That way,  they can use that state to determine if the div was selected or not.
	//
	// this.props.gpioDiv : Object {pin: "J6_0_0", x: 210, y: 48, gpio: undefined}
	// data.gpioDiv : Object {location: "J6_4_1", pin: "13", gpio: "102", description: "pin 13 inner bank"}
 	componentDidMount: function() {
		console.log(" ++ GpioDiv - componentDidMount");
 		var that = this;
 		
 		CustomEvents.subscribe("GpioDiv",MASTERLISTITEM_SELECTION, function(data) {
 			console.log(" ++ GpioDiv - RECEIVED MASTERLISTITEM_SELECTION EVENT " + data);
 			console.log("gpioDiv setting state " + (data.gpioDiv ? data.gpioDiv.pin : ""));
 			//if (that.isMounted()) {
				that.setState({selectedGpioDiv:data.gpioDiv});
			//}
		});

 	},

		//BUG: shows reactJS errors in console when commented.
		//BUG: shows no reactJS errors in console when uncommented but fails to show detail pane
		//BUG : Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the GpioDiv component.
 	componentWillUnmount: function() {
 		console.log(" ++ GpioDiv - componentWillUnmount");
		CustomEvents.unsubscribe("GpioDiv",MASTERLISTITEM_SELECTION); 
 	}, 


 	// IMPROVEMENT : before we opened up the modal here. now we open it in Gpio:componentDidMount
 	componentDidUpdate: function(prevProps,prevState) {
		console.log(" ++ GpioDiv - componentDidUpdate : " + this.isSelected());
 	},

	isSelected: function() {
		if (!this.state.selectedGpioDiv) return false;
		return this.props.gpioDiv.pin === this.state.selectedGpioDiv.location;
	},

	getBackgroundColor: function() {
		var backgroundColor;
		console.log("Getting background for " + JSON.stringify(this.props.gpioDiv.gpio));
		if (!this.props.gpioDiv.gpio) {
			return "grey";
		} else {
			if (this.isSelected()) {
				return "red";	
			} else {
				if (this.props.gpioDiv.gpio.type==="power") {
					return "#ffd9b3";
				} else if (this.props.gpioDiv.gpio.type==="gnd") {
					return "#000000";
				} else if (this.props.gpioDiv.gpio.type==="serial") {
					return "#d9b3ff"
				} else if (this.props.gpioDiv.gpio.type==="spi") {
					return "#99ddff"
				} else if (this.props.gpioDiv.gpio.type==="i2c") {
					return "#ffffe5"
				} else if (this.props.gpioDiv.gpio.type=="gpio") {
					return "#b3ffb3";
				}

				// Default
				return "green";
			} 
		}

	},

	render: function() {

		var divStyle = {
			width: "15px",
			height: "15px",
			left: this.props.gpioDiv.x + "px",
			top: this.props.gpioDiv.y + "px",
			backgroundColor: this.getBackgroundColor()
		};

		return (
			<div className="gpioTag" style={divStyle} onClick={this.gpioSelected} />
		);
	}

});

/*
 | <Gpio> component representing a single GPIO.
 |
 | It renders a detail pane allowing us to perform the following actions on the GPIO
 |
 | - export/unexport the GPIO
 | - set the direction (in/out) of the GPIO
 | - set the value of the GPIO 
 | - read the value of the GPIO
 | 
 | States associated here
 |
 | this.state.gpioValue
 | this.state.gpioGetValueError
 | this.state.gpioSetValueError
 |
 | this.state.gpioDirection
 | this.state.gpioDirectionError
 | this.state.gpioSetDirectionError
 |
 | this.state.gpioExported
 | this.state.gpioExportError
 |
 */
 var Gpio = React.createClass({


 	getInitialState: function() {
 		return {gpioValue: 0};
 	},

 	// First thing we try to do is determine the direction.
 	// If this call success
 	componentDidMount: function() {
 		console.log(" +++ Gpio - componentDidMount");

		$('#gpioDetailModal').modal('show');

		$('#gpioDetailModal').on('hidden.bs.modal', function () {
			console.log("closing modal");
			CustomEvents.notify(MASTERLISTITEM_SELECTION, {gpioDiv:null});
		})

 		this.retrieveGpioDirection(); 		
 	},

 	componentWillUnmount: function() {
 		console.log(" ++ Gpio - componentWillUnmount");
		
 	},  	

 	retrieveGpioValue: function() {
 		app.restApi.retrieveGpioValue(
 			this.props.gpio,
 			function success(data) {
 				this.setState({gpioValue: data.message,gpioGetValueError: null});
 			}.bind(this),
 			function error(xhr, status, err) {
				this.setState({gpioGetValueError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});				
 			}.bind(this)
 		);
 	},

 	retrieveGpioDirection: function() {
 		app.restApi.retrieveGpioDirection(
 			this.props.gpio,
 			function success(data) {
 				this.setState({
 						gpioDirection: data.message,
 						gpioDirectionError: null,
 						gpioSetDirectionError: null
 				});
 				this.retrieveGpioValue();
 				//setInterval(this.retrieveGpioValue, 1000);
 			}.bind(this),
 			function error(xhr, status, err) {
				this.setState({gpioDirectionError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
		
 	},

 	toggleGpio: function(val) {
		app.restApi.toggleGpio(
 			this.props.gpio,
 			val,
 			function success(data) {
 				this.setState({gpioSetValueError: null});
 			}.bind(this),
 			function error(xhr, status, err) {
				this.setState({gpioSetValueError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 	},	

 	changeGpioDirection: function(direction) {
 		app.restApi.changeGpioDirection(
 			this.props.gpio,
 			direction, 
 			function success() {
 				this.retrieveGpioDirection();
 				this.setState({gpioSetDirectionError: null}); 				
 			}.bind(this),
			function error(xhr, status, err) {
				this.setState({gpioSetDirectionError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 	},	 

 	exportGpio: function() {
 		app.restApi.exportGpio(
 			this.props.gpio,
 			function success() {
 				this.retrieveGpioDirection();
 				this.setState({gpioExportError: null}); 				
 			}.bind(this),
			function error(xhr, status, err) {
				this.setState({gpioExportError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 		
 	},

 	unExportGpio: function() {
 		app.restApi.unExportGpio(
 			this.props.gpio,
 			function success() {
 				this.retrieveGpioDirection();
 				this.setState({gpioExportError: null}); 				
 			}.bind(this),
			function error(xhr, status, err) {
				this.setState({gpioExportError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 		
 	}, 	

 	render: function() {

 		//TODO: replace this with classNames
 		var btnDirectionOutputClass = "btn btn-default" + (("out"===this.state.gpioDirection) ? " disabled" : "");	
 		var btnDirectionInputClass = "btn btn-default" + (("in"===this.state.gpioDirection) ? " disabled" : "");
 		return (

			<div className="modal fade" id="gpioDetailModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">
			      <div className="modal-header">
			        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 className="modal-title" id="myModalLabel">Pin details</h4>
			      </div>
			      <div className="modal-body">
					<p>
					Here you can export a GPIO, change its direction, or get/set its value.
					</p>

					<table className="table table-bordered table-striped">
					   <tbody>
							<tr>
								<th className="text-nowrap" scope="row">PIN</th>
								<td>
									{this.props.pin} 
									{!this.state.gpioDirectionError && " (GPIO Exported)"}
								</td>
							</tr>
							<tr>
								<th className="text-nowrap" scope="row">Description</th>
								<td>{this.props.description}</td>
							</tr>

							<tr>
								<th className="text-nowrap" scope="row">Set</th>
								<td>
									<button type="button" className="btn btn-default" onClick={this.toggleGpio.bind(this,true)}>ON</button>
									<button type="button" className="btn btn-default" onClick={this.toggleGpio.bind(this,false)}>OFF</button>
									<div className="error">{this.state.gpioSetValueError}</div>
								</td>
							</tr>

							<tr>
								<th className="text-nowrap" scope="row">Export</th>
								<td>
									
										<div className="error">{this.state.gpioDirectionError}
											<p>
												<button type="button" className="btn btn-default" onClick={this.exportGpio}>Export</button>
												<button type="button" className="btn btn-default" onClick={this.unExportGpio}>un-Export</button>												
											</p>
										</div>

									<div className="error">{this.state.gpioExportError}</div>
								</td>
							</tr>

							<tr>
								<th className="text-nowrap" scope="row">Direction</th>
								<td>
								    <p>{this.state.gpioDirection}</p>
									<button type="button" className={btnDirectionInputClass} onClick={this.changeGpioDirection.bind(this,"in")}>Input</button>
									<button type="button" className={btnDirectionOutputClass} onClick={this.changeGpioDirection.bind(this,"out")}>Output</button>
									<div className="error">{this.state.gpioSetDirectionError}</div>
								</td>
							</tr>

							<tr>
								<th className="text-nowrap" scope="row">Value</th>
								<td>
									<p>{this.state.gpioValue}</p>
									<button type="button" className="btn btn-default" onClick={this.retrieveGpioValue}>Refresh Value</button>
									<div className="error">{this.state.gpioGetValueError}</div>
								</td>
								
							</tr>      
					   </tbody>
					</table>

			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
			      </div>
			    </div>
			  </div>
			</div>
 			);
 	}
});

var CustomEvents = (function() {
  var _map = {};

  return {
    subscribe: function(clientId,name, cb) {
      _map[name] || (_map[name] = []);
      _map[name].push({clientId:clientId,cb:cb});
    },

    unsubscribe: function(clientId,name) {
		for (var i = _map[name].length-1; i >= 0; i--) {
		    if (_map[name][i].clientId === clientId) {
		        _map[name].splice(i, 1);
		    }
		}
    },

    notify: function(name, data) {
		if (!_map[name]) {
			return;
		}

		// if you want canceling or anything else, add it in to this cb loop
		_map[name].forEach(function(cb) {
			cb.cb(data);
		});
    }
  }
})();

	function render() {
		ReactDOM.render(<BoardSelection />,document.getElementById('content'));
	}

	render();

})();
