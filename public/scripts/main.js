var Board = React.createClass({
  render: function() {
    return (
      <div className="board">
        <h1>Board</h1>
        <GpioList gpios={this.props.gpios} apiPath={this.props.apiPath}/>
      </div>
    );
  }
});

var GpioList = React.createClass({

  render: function() {

  	var apiPath = this.props.apiPath;
	var gpioNodes = this.props.gpios.map(function(gpio) {
      return (
        <Gpio pin={gpio.pin} gpio={gpio.gpio} description={gpio.description} apiPath={apiPath}/>
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
		    //console.error(this.props.url, status, err.toString());
		  }.bind(this)
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
	    	<tr>
				<td>{this.props.pin}</td>
				<td>{this.props.description}</td>
				<td><div onClick={this.toggleGpio.bind(this,true)}>ON</div></td>
				<td><div onClick={this.toggleGpio.bind(this,false)}>OFF</div></td>
				<td><div onClick={this.exportGpio}>Export</div></td>
				<td><div onClick={this.changeGpioDirection.bind(this,"in")}>Input</div></td>
				<td><div onClick={this.changeGpioDirection.bind(this,"out")}>Output</div></td>
				<td>Value = {this.state.gpioValue}</td>
			</tr>
	    );
	}
});

var gpios = [
	{"key":1, "pin":"13","gpio":"102","description":"pin 13 inner bank"},
	{"key":2, "pin":"12","gpio":"100","description":"pin 12 inner bank"},
	{"key":3, "pin":"11","gpio":"147","description":"pin 11 inner bank"},
	{"key":3, "pin":"8","gpio":"105","description":"pin 8 inner bank"},
	{"key":4, "pin":"2","gpio":"104","description":"pin 2 inner bank"},
	{"key":5, "pin":"3","gpio":"143","description":"pin 3 inner bank"},
	{"key":6, "pin":"4","gpio":"142","description":"pin 4 inner bank"},
	{"key":7, "pin":"42","gpio":"127","description":"pin 42 outer bank"}
];


ReactDOM.render(<Board gpios={gpios} apiPath="/udooneorest"/>,document.getElementById('content'));
