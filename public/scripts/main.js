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
	"imageUrl":"./images/neo-top-view.jpg",
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
		{"location":"J6_0_0","pin":"33","gpio":"21","description":"CSI1_DATA09 UART6_CTS_B I2C4_SDA"},
		{"location":"J6_1_0","pin":"32","gpio":"20","description":"CSI1_DATA08 UART6_RTS_B I2C4_SCL"},
		{"location":"J6_2_0","pin":"31","gpio":"19","description":"CSI1_DATA07 UART6_TX_DATA PWM_6"},
		{"location":"J6_3_0","pin":"30","gpio":"18","description":"CSI1_DATA06 UART6_RX_DATA PWM_5"},
		{"location":"J6_4_0","pin":"29","gpio":"17","description":"CSI1_DATA05 UART6_DCD_B"},
		{"location":"J6_5_0","pin":"28","gpio":"16","description":"CSI1_DATA04 UART6_DTR_B"},
		{"location":"J6_6_0","pin":"27","gpio":"15","description":"CSI1_DATA03 UART6_DSR_B"},
		{"location":"J6_7_0","pin":"26","gpio":"14","description":"CSI1_DATA02 UART6_RI_B"},
		{"location":"J6_8_0","pin":"25","gpio":"22","description":"CSI1_HSYNC"},
		{"location":"J6_9_0","pin":"24","gpio":"25","description":"CSI1_VSYNC"},


		{"location":"J4_0_0","pin":"23","gpio":"124","description":"CSI1_PXCLK"},
		{"location":"J4_1_0","pin":"22","gpio":"182","description":""},
		{"location":"J4_2_0","pin":"21","gpio":"173","description":"ECSPI2_MOSI"},
		{"location":"J4_3_0","pin":"20","gpio":"172","description":"ECSPI2_MISO"},
		{"location":"J4_4_0","pin":"19","gpio":"181","description":""},
		{"location":"J4_5_0","pin":"18","gpio":"180","description":""},
		{"location":"J4_6_0","pin":"17","gpio":"107","description":"PWM_4"},
		{"location":"J4_7_0","pin":"16","gpio":"106","description":"PWM_3"},


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
	    {"location":"J8_0_0","pin":"2","gpio":"N/A","description":"5V"},
	    {"location":"J8_1_0","pin":"4","gpio":"N/A","description":"5V"},
	    {"location":"J8_2_0","pin":"6","gpio":"N/A","description":"GND"},
	    {"location":"J8_3_0","pin":"8","gpio":"14","description":"UART_TXD"},
	    {"location":"J8_4_0","pin":"10","gpio":"15","description":"UART_RXD"},
		{"location":"J8_5_0","pin":"12","gpio":"18","description":"GPIO 18"},
	    {"location":"J8_6_0","pin":"14","gpio":"N/A","description":"GND"},
	    {"location":"J8_7_0","pin":"16","gpio":"23","description":"GPIO 23"},
	    {"location":"J8_8_0","pin":"18","gpio":"24","description":"GPIO 24"},
	    {"location":"J8_9_0","pin":"20","gpio":"N/A","description":"GND"},
	    {"location":"J8_10_0","pin":"22","gpio":"25","description":"GPIO 25"},
	    {"location":"J8_11_0","pin":"24","gpio":"8","description":"SPI_CE0"},
	    {"location":"J8_12_0","pin":"26","gpio":"7","description":"SPI_CE1"},
	    {"location":"J8_13_0","pin":"28","gpio":"N/A","description":"ID_SC"},
	    {"location":"J8_14_0","pin":"30","gpio":"N/A","description":"GND"},
		{"location":"J8_15_0","pin":"32","gpio":"12","description":"GPIO 12"},
	    {"location":"J8_16_0","pin":"14","gpio":"N/A","description":"GND"},
	    {"location":"J8_17_0","pin":"36","gpio":"16","description":"GPIO 16"},
	    {"location":"J8_18_0","pin":"38","gpio":"20","description":"GPIO 20"},
	    {"location":"J8_19_0","pin":"40","gpio":"21","description":"GPIO 21"},
		
		{"location":"J8_0_1","pin":"1","gpio":"N/A","description":"3.3V"},
	    {"location":"J8_1_1","pin":"3","gpio":"2","description":"I2C1_SDA"},
	    {"location":"J8_2_1","pin":"5","gpio":"3","description":"I2C1_SCL"},
	    {"location":"J8_3_1","pin":"7","gpio":"14","description":"UART_TXD"},
	    {"location":"J8_4_1","pin":"9","gpio":"N/A","description":"GND"},
		{"location":"J8_5_1","pin":"11","gpio":"17","description":"GPIO 17"},
	    {"location":"J8_6_1","pin":"13","gpio":"27","description":"GPIO 27"},
	    {"location":"J8_7_1","pin":"15","gpio":"22","description":"GPIO 22"},
	    {"location":"J8_8_1","pin":"17","gpio":"N/A","description":"3.3V"},
	    {"location":"J8_9_1","pin":"19","gpio":"10","description":"GPIO 10 (SPI_MOSI)"},
	    {"location":"J8_10_1","pin":"21","gpio":"9","description":"GPIO 9 (SPI_MISO)"},
	    {"location":"J8_11_1","pin":"23","gpio":"11","description":"GPIO 11 (SPI_SCLK)"},
	    {"location":"J8_12_1","pin":"25","gpio":"N/A","description":"GND"},
	    {"location":"J8_13_1","pin":"27","gpio":"N/A","description":"ID_SD"},
	    {"location":"J8_14_1","pin":"29","gpio":"5","description":"GPIO 5"},
		{"location":"J8_15_1","pin":"31","gpio":"6","description":"GPIO 6"},
	    {"location":"J8_16_1","pin":"33","gpio":"13","description":"GPIO 13"},
	    {"location":"J8_17_1","pin":"35","gpio":"19","description":"GPIO 19"},
	    {"location":"J8_18_1","pin":"37","gpio":"26","description":"GPIO 26"},
	    {"location":"J8_19_1","pin":"30","gpio":"N/A","description":"GND"}
	    	    

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
