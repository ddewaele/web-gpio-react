 const MASTERLISTITEM_SELECTION = "masterListItemSelection";


/*
 | Our main board. 
 | 
 | Top-level object. Displays the board name, image, divs and detail pane.
 |
 */
 var Board = React.createClass({

 	render: function() {
 		return (
			<div className="parent">
	 			<div className="board">
		 			<h1>{this.props.boardConfig.name}</h1>

		 			<DetailPane apiPath={this.props.apiPath}/>

		 			<div className="boardcontainer">
			 			<GpioDivList boardConfig={this.props.boardConfig}/>
			 			<img src={this.props.boardConfig.imageUrl}/>
					</div>
	 			</div>

 			</div>
 		);
 	}
 });


var BoardSelection = React.createClass({


     getInitialState: function() {
         return {
             value: "boardConfigNeo"
         }
     },
     change: function(event){
         this.setState({value: event.target.value});
     },
     render: function(){

     	var boardOptionsArr = [];
		for (var property in this.props.boardOptions) {
		    if (this.props.boardOptions.hasOwnProperty(property)) {
		        boardOptionsArr.push(
		        	{"value":property,"label":this.props.boardOptions[property].name}
		        );
		    }
		}

     	var boardOptions2 = boardOptionsArr.map(function(boardOption) {
 			return (
 				<BoardOption key={boardOption.value} value={boardOption.value} label={boardOption.label} />
 			);
 		});

        return(
           <div>
               <select id="lang" onChange={this.change} value={this.state.value}>
                  <option value="select">Select</option>
			        {boardOptions2}
               </select>
                <Board apiPath="/udooneorest" boardConfig={this.props.boardOptions[this.state.value]}/>
           </div>
        );
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

 		var that = this;
		CustomEvents.subscribe(MASTERLISTITEM_SELECTION, function(data) {
			that.setState({selectedGpio:data.gpioDiv});
		});

 	},

 	componentDidUnMount: function() {
		CustomEvents.unsubscribe(MASTERLISTITEM_SELECTION);
 	},  	

 	render: function() {
 		return (
 			<div className="detailPane" style={{float:"right", width:"300px"}}>
	 			<h2>Detail pane</h2>
	 			{this.state.selectedGpio && <Gpio key={this.state.selectedGpio.pin} pin={this.state.selectedGpio.pin} gpio={this.state.selectedGpio.gpio} description={this.state.selectedGpio.description} apiPath={this.props.apiPath}/>}
 			</div>

 		);
 	}

 });

/*
 | A list of GPIOs. 
 | Used in the board component. 
 | (currently renders the GPIOs inside a table)=
 |
 | Uses the map function of the JS array to return individual ReactJS components.
 */
 var GpioList = React.createClass({

 	render: function() {

 		var apiPath = this.props.apiPath;
 		var gpioNodes = this.props.boardConfig.gpios.map(function(gpio) {
 			return (
 				<Gpio key={gpio.pin} pin={gpio.pin} gpio={gpio.gpio} description={gpio.description} apiPath={apiPath}/>
 			);
 		});

 		return (
 			<table>
 			<tbody>
 			{gpioNodes}
 			</tbody>
 			</table>
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

 		var that = this;
		CustomEvents.subscribe(MASTERLISTITEM_SELECTION, function(data) {
			that.setState({selectedgpioDiv:data.gpioDiv});
		});

 	},

 	componentDidUnMount: function() {
		CustomEvents.unsubscribe(MASTERLISTITEM_SELECTION);
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
 		//this.props.selectGioDiv(this);		
 	},

	//
	// this.props.gpioDiv : Object {pin: "J6_0_0", x: 210, y: 48, gpio: undefined}
	// data.gpioDiv : Object {location: "J6_4_1", pin: "13", gpio: "102", description: "pin 13 inner bank"}
 	componentDidMount: function() {

 		var that = this;
 		
 		CustomEvents.subscribe(MASTERLISTITEM_SELECTION, function(data) {
 			console.log("gpioDiv setting state " + data.gpioDiv.pin);
			that.setState({selectedGpioDiv:data.gpioDiv});
		});

 	},

 	componentDidUnMount: function() {
		CustomEvents.unsubscribe(MASTERLISTITEM_SELECTION);
 	}, 

	isSelected: function() {
		if (!this.state.selectedGpioDiv) return false;
		return this.props.gpioDiv.pin === this.state.selectedGpioDiv.location;
	},

	render: function() {

		var backgroundColor;

		console.log("Rendering " + this.props.gpioDiv.pin + " - " + ((this.state.selectedgpioDiv) ? this.state.selectedgpioDiv.pin : ""));
		if (!this.props.gpioDiv.gpio) {
			backgroundColor = "grey";
		} else {
			if (this.isSelected()) {
				backgroundColor = "red";	
			} else {
				backgroundColor = "green";
			} 
		}


		var divStyle = {
			width: "15px",
			height: "15px",
			left: this.props.gpioDiv.x + "px",
			top: this.props.gpioDiv.y + "px",
			 backgroundColor: backgroundColor
		};

		return (
			<div className="gpioTag" style={divStyle} onClick={this.gpioSelected}/>
		);
	}

});

/*
 | <Gpio> component representing a single GPIO.
 |
 | Renders a detail pane allowing us to perform the following actions on the GPIO
 |
 | - export the GPIO
 | - set the direction of the GPIO
 | - set the value of the GPIO 
 | - read the value of the GPIO
 | 
 */
 var Gpio = React.createClass({


 	getInitialState: function() {
 		return {gpioValue: 0};
 	},

 	executeAjaxCall: function(url,method) {
 		$.ajax({
 			url: url,
 			dataType: 'json',
 			method: method,
 			cache: false,
 			success: function(data) {
 				console.log("Result ok " + data);
		    //this.setState({data: data});
		},
		error: function(xhr, status, err) {
			console.log("Error occured " + status);
		    //console.error(this.props.url, status, err.toString());
		}
	});
 	},

 	retrieveGpioValue: function() {
 		var gpio = this.props.gpio;
 		$.ajax({
 			url: this.props.apiPath + "/gpio/" + gpio + "/value",
 			dataType: 'json',
 			method: 'GET',
 			cache: false,
 			success: function(data) {
 				console.log("Found GPIO  " + gpio + " value = " + data.message);
 				this.setState({gpioValue: data.message});
 			}.bind(this),
 			error: function(xhr, status, err) {
 				console.log("Error occured " + status);
		  }.bind(this) // needed to be able to use the this keyboard in the callbacks.
		});		
 	},

 	toggleGpio: function(val) {
 		console.log("Turning " + this.props.pin + " " + (val ? "ON" : "OFF"));
 		this.changeGpioState(val);
 	},

 	changeGpioState: function(on) {
 		var url = this.props.apiPath + "/gpio/" + this.props.gpio + "/value/" + (on ? "1"  : "0");
 		this.executeAjaxCall(url,'PUT');
 	},	

 	changeGpioDirection: function(direction) {
 		var url = this.props.apiPath + "/gpio/" + this.props.gpio + "/direction/" + direction;
 		this.executeAjaxCall(url,'PUT');
 	},	 

 	exportGpio: function() {
 		var url = this.props.apiPath + "/gpio/" + this.props.gpio + "/export";
 		this.executeAjaxCall(url,'POST');		
 	},

 	render: function() {

 		return (
 			<table>
 			<tbody>

 			<tr>
 			<td>Pin</td><td>{this.props.pin}</td>
 			</tr>
 			<tr>
 			<td>Description</td><td>{this.props.description}</td>
 			</tr>

 			<tr>
 			<td>Set</td><td><div onClick={this.toggleGpio.bind(this,true)}>ON</div></td>
 			</tr>

 			<tr>
 			<td>Set</td><td><div onClick={this.toggleGpio.bind(this,false)}>OFF</div></td>
 			</tr>

 			<tr>
 			<td>Export</td><td><div onClick={this.exportGpio}>Export</div></td>
 			</tr>

 			<tr>
 			<td>Direction</td><td><div onClick={this.changeGpioDirection.bind(this,"in")}>Input</div></td>
 			</tr>

 			<tr>
 			<td>Direction</td><td><div onClick={this.changeGpioDirection.bind(this,"out")}>Output</div></td>
 			</tr>
 			<tr>
 			<td>Value</td><td>{this.state.gpioValue}</td>
 			</tr>

 			</tbody>
 			</table>
 			);
 	}
 });

var boardConfigNeo = {
	"name":"UDOO Neo",
	"imageUrl":"./images/neo-top-view.png",
	"headers":[
	{
			"name":"J6", 			// the name of the header  (J6)
			"xyCoords":[210,48],    // the top xy coords (210,45)
		    "rows":10, 				// nr of rows (10)
		    "cols":2, 				// nr of columns (2)
		    "spaceX":25, 			// space between items on same row in px (25)
		    "spaceY":24				// space between items on same column in px ()
		},		
		{
			"name":"J4", 			
			"xyCoords":[485,48],    
			"rows":8, 				
			"cols":2, 				
			"spaceX":25, 		
			"spaceY":24				
		},		
		{
			"name":"J7", 			
			"xyCoords":[536,567],   
			"rows":6, 				
			"cols":2, 				
			"spaceX":25, 			
			"spaceY":24				
		},	
		{
			"name":"J5", 			
			"xyCoords":[304,567],   
			"rows":8, 				
			"cols":2, 				
			"spaceX":25, 			
			"spaceY":24				
		}		    	    
	],
	"gpios": [
		{"location":"J6_4_1","pin":"13","gpio":"102","description":"pin 13 inner bank"},
		{"location":"J6_5_1","pin":"12","gpio":"100","description":"pin 12 inner bank"},
		{"location":"J6_6_1","pin":"11","gpio":"147","description":"pin 11 inner bank"},
		{"location":"J6_9_1","pin":"8","gpio":"105","description":"pin 8 inner bank"},
		{"location":"J4_5_1","pin":"2","gpio":"104","description":"pin 2 inner bank"},
		{"location":"J4_4_1","pin":"3","gpio":"143","description":"pin 3 inner bank"},
		{"location":"J4_3_1","pin":"4","gpio":"142","description":"pin 4 inner bank"},
		{"location":"J5_5_1","pin":"42","gpio":"127","description":"pin 42 outer bank"}
	]

}

var boardConfigPiZero = {
	"name":"Raspberry PI Zero",
	"imageUrl":"./images/rpi_zero.jpg",
	"headers":[
	{
			"name":"J8", 			// the name of the header  (J6)
			"xyCoords":[145,26],    // the top xy coords (210,45)
		    "rows":20, 				// nr of rows (10)
		    "cols":2, 				// nr of columns (2)
		    "spaceX":35.5, 			// space between items on same row in px (25)
		    "spaceY":38				// space between items on same column in px ()
		},		
		{
			"name":"J5", 			
			"xyCoords":[780,95],   
			"rows":2, 				
			"cols":2, 				
			"spaceX":38, 			
			"spaceY":38				
		}		    	    
	],
	"gpios": [
		{"location":"J8_4_1","pin":"13","gpio":"102","description":"pin 13 inner bank"},
		{"location":"J8_5_1","pin":"12","gpio":"100","description":"pin 12 inner bank"},
		{"location":"J8_6_1","pin":"11","gpio":"147","description":"pin 11 inner bank"},
		{"location":"J8_9_1","pin":"8","gpio":"105","description":"pin 8 inner bank"},
		{"location":"J8_5_1","pin":"2","gpio":"104","description":"pin 2 inner bank"},
		{"location":"J8_4_1","pin":"3","gpio":"143","description":"pin 3 inner bank"},
		{"location":"J8_3_1","pin":"4","gpio":"142","description":"pin 4 inner bank"},
		{"location":"J5_1_1","pin":"42","gpio":"127","description":"pin 42 outer bank"}
	]

}

var boardOptions = {
	"boardConfigNeo":boardConfigNeo,
	"boardConfigPiZero":boardConfigPiZero
};

var CustomEvents = (function() {
  var _map = {};

  return {
    subscribe: function(name, cb) {
      _map[name] || (_map[name] = []);
      _map[name].push(cb);
    },

    unsubscribe: function(name) {
    	delete _map[name];
    },

    notify: function(name, data) {
      if (!_map[name]) {
        return;
      }

      // if you want canceling or anything else, add it in to this cb loop
      _map[name].forEach(function(cb) {
        cb(data);
      });
    }
  }
})();

ReactDOM.render(<BoardSelection boardOptions={boardOptions}/>,document.getElementById('content'));
