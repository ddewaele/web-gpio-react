/*
 | Our main board. 
 | 
 | Top-level object.
 |
 */
 var Board = React.createClass({

 	render: function() {
 		return (
 			<div className="board">
 			<h1>{this.props.boardConfig.name}</h1>

 			<DetailPane apiPath={this.props.apiPath}/>

 			<div className="boardcontainer">
 			<GpioDivList boardConfig={this.props.boardConfig}/>
 			<img src={this.props.boardConfig.imageUrl}/>
 			</div>

 			</div>
 		);
 	}
 });

 var DetailPane = React.createClass({

 	getInitialState: function() {
 		return {selectedGpio: gpios[0]};
 	},

 	render: function() {
 		return (

 			<div className="detailPane" style={{float:"right", width:"300px"}}>
 			<h2>Detail pane</h2>
 			<div id="detailText"/>

 			<p>Not sure how to change this state from the gpio selection</p>
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
 		var gpioNodes = this.props.gpios.map(function(gpio) {
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
 | Represents the contianer object that renders a list of GpioDiv objects.
 | 
 */
 var GpioDivList = React.createClass({


 	getInitialState: function() {
 		return {selectedGpioDiv: null};
 	},

 	constructGpioDivs: function() {

 		var gpioHeaders = this.props.boardConfig.headers;
 		var arrayLength = gpioHeaders.length;

 		var gpioDivs = [];

 		for (var i = 0; i < arrayLength; i++) {

 			var header = gpioHeaders[i];
 			var beginX = header.xyCoords[0];
 			var beginY = header.xyCoords[1];

 			for (var j = 0; j < header.rows ; j++) {
 				for (var k = 0; k < header.cols ; k++) {
 					gpioDivs.push({
 						"pin":header.name + "_" + j + "_" + k,
 						"x":beginX + (j * header.spaceX),
 						"y":beginY + (k * header.spaceY)
 					})
 				}

 			}
 		}

 		return gpioDivs;

 	},

	// HELP: STUCK : seems weird to be passing gpioDiv here (the react component). need to drill down via props to the actual gpioDiv pojo.
	// HELP: STUCK : the distinction between working with components and their state is not always clear.
	selectGioDiv: function(gpioDiv) {
		console.log("selectGioDiv : " + gpioDiv); // this is the react component

		this.setState({selectedGpioDiv:gpioDiv.props.gpioDiv});

		//gpioDiv.select();

		$("#detailText").text("Selected " + gpioDiv.props.gpioDiv.pin);
		

		// HELP:STUCK .... how do I select a single GPIO and take care of unselecting the rest.
		// HELP:STUCK .... where should I put the select logic , the state , and the selecting / unselecting of the gpiodivs.
		// var children = gpioDiv.parent.children;
		// var arrayLength = children.length;
		// for (var i = 0; i < arrayLength; i++) {
		// 	children[i].unselect();
		// }


	},

	// HELP: STUCK : seems weird to use the pin state to determine if a given gpioDiv is selected or not.

	isGpioDivSelected: function(gpioDiv) {
		if (this.state.selectedGpioDiv==null) return false;
		return (gpioDiv.pin === this.state.selectedGpioDiv.pin)
	},

	render: function() {
		var that = this;
		var divNodes = this.constructGpioDivs().map(function(gpioDiv) {

			return (

				<GpioDiv ref={gpioDiv.pin} key={gpioDiv.pin} gpioDiv={gpioDiv} selectGioDiv={that.selectGioDiv} isGpioDivSelected={that.isGpioDivSelected}/>	       

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

	// HELP: STUCK - intially I had put the selected state here. 
	// I then moved the state to the parent component (GpioDivList) cause I needed to reference it against other GpioDiv objects.

	// getInitialState: function() {
	// 	return {selected: false};
 	// },



 	gpioSelected: function(pin) {
 		this.props.selectGioDiv(this);		
 	},

	// select: function() {
	// 	this.setState({selected:true});
	// },

	// unselect: function() {
	// 	this.setState({selected:false});
	// },

	// HELP: STUCK : the check to see if a GPIO is selected is done on the list level (Correct) ?
	isSelected: function() {
		return this.props.isGpioDivSelected(this.props.gpioDiv);
	},

	render: function() {

		var divStyle = {
			width: "15px",
			height: "15px",
			left: this.props.gpioDiv.x + "px",
			top: this.props.gpioDiv.y + "px",
			backgroundColor: (this.isSelected() ? "red" : "green")
		};

		return (
			<div className="gpioTag" style={divStyle} onClick={this.gpioSelected}/>
		);
	}

});

/*
 | Represents a single GPIO.
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

var gpios = [
{"location":"J6_5_1","pin":"13","gpio":"102","description":"pin 13 inner bank"},
{"location":"J6_6_1","pin":"12","gpio":"100","description":"pin 12 inner bank"},
{"location":"J6_7_1","pin":"11","gpio":"147","description":"pin 11 inner bank"},
{"location":"J6_10_1","pin":"8","gpio":"105","description":"pin 8 inner bank"},
{"location":"J4_6_1","pin":"2","gpio":"104","description":"pin 2 inner bank"},
{"location":"J4_5_1","pin":"3","gpio":"143","description":"pin 3 inner bank"},
{"location":"J4_4_1","pin":"4","gpio":"142","description":"pin 4 inner bank"},
{"location":"J5_6_1","pin":"42","gpio":"127","description":"pin 42 outer bank"}
];

var boardConfig = {
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
	]

}

ReactDOM.render(<Board gpios={gpios} apiPath="/udooneorest" boardConfig={boardConfig}/>,document.getElementById('content'));
