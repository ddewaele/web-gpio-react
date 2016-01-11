/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import RestApi from '../RestApi/RestApi';
import {Modal,Button} from 'react-bootstrap';

import './Gpio.css';

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
class Gpio extends Component {

	constructor(props) {
    	super(props);
    	this.state = {gpioValue: 0,isLoading: false};
  	}

 	// First thing we try to do is determine the direction.
 	// If this call success
 	componentDidMount() {
 		console.log(" +++ Gpio - componentDidMount");

 		//$('#gpioDetailModal').modal('show');

		$('#gpioDetailModal').on('hidden.bs.modal', function () {
			console.log("closing modal");
			CustomEvents.notify(MASTERLISTITEM_SELECTION, {gpioDiv:null});
		})

		this.setState({showModal: true});
 		this.retrieveGpioDirection(); 		
 	}

 	componentWillUnmount() {
 		console.log(" ++ Gpio - componentWillUnmount");
		
 	}

 	retrieveGpioValue() {
 		RestApi.retrieveGpioValue(
 			this.props.gpio,
 			function success(data) {
 				this.setState({gpioValue: data.message,gpioGetValueError: null});
 			}.bind(this),
 			function error(xhr, status, err) {
				this.setState({gpioGetValueError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});				
 			}.bind(this)
 		);
 	}

 	retrieveGpioDirection() {
 		console.log("Found Rets API = " + RestApi);
 		console.log("Found Rets API = " + RestApi.retrieveGpioDirection);
 		RestApi.retrieveGpioDirection(
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
		
 	}

 	toggleGpio(val) {
		RestApi.toggleGpio(
 			this.props.gpio,
 			val,
 			function success(data) {
 				this.setState({gpioSetValueError: null});
 			}.bind(this),
 			function error(xhr, status, err) {
				this.setState({gpioSetValueError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 	}

 	changeGpioDirection(direction) {
 		RestApi.changeGpioDirection(
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
 	} 

 	exportGpio() {
 		RestApi.exportGpio(
 			this.props.gpio,
 			function success() {
 				this.retrieveGpioDirection();
 				this.setState({gpioExportError: null}); 				
 			}.bind(this),
			function error(xhr, status, err) {
				this.setState({gpioExportError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 		
 	}

 	unExportGpio() {
 		RestApi.unExportGpio(
 			this.props.gpio,
 			function success() {
 				this.retrieveGpioDirection();
 				this.setState({gpioExportError: null}); 				
 			}.bind(this),
			function error(xhr, status, err) {
				this.setState({gpioExportError: (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText)});
		  	}.bind(this)
 		);
 		
 	} 	

 	handleClick() {
    	this.setState({isLoading: true});

	    // This probably where you would have an `ajax` call
	    setTimeout(() => {
	      // Completed of async action, set loading state back
	      this.setState({isLoading: false, showModal: true});
	    }, 2000);
  	} 	

  	close() {
    	this.setState({ showModal: false });
  	}

 	render() {

 		let isLoading = this.state.isLoading;
 		//TODO: replace this with classNames
 		var btnDirectionOutputClass = "btn btn-default" + (("out"===this.state.gpioDirection) ? " disabled" : "");	
 		var btnDirectionInputClass = "btn btn-default" + (("in"===this.state.gpioDirection) ? " disabled" : "");
 		return (
 			<div>

				<Modal show={this.state.showModal} onHide={this.close.bind(this)}>
					<Modal.Header closeButton>
				    	<Modal.Title>Pin Details</Modal.Title>
					</Modal.Header>
				    <Modal.Body>
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
													<button type="button" className="btn btn-default" onClick={this.exportGpio.bind(this)}>Export</button>
													<button type="button" className="btn btn-default" onClick={this.unExportGpio.bind(this)}>un-Export</button>												
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
										<button type="button" className="btn btn-default" onClick={this.retrieveGpioValue.bind(this)}>Refresh Value</button>
										<div className="error">{this.state.gpioGetValueError}</div>
									</td>
									
								</tr>      
						   </tbody>
						</table>
			         </Modal.Body>
	          		<Modal.Footer>
	            		<Button onClick={this.close.bind(this)}>Close</Button>
	          		</Modal.Footer>
	        	</Modal>
			</div>
 		);
 	}

}

export default Gpio;



