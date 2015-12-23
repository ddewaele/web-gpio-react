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

// var boardOptions = [
// 	{"key":"boardConfigNeo","value":boardConfigNeo},
// 	{"key":"boardConfigPiZero","value":boardConfigPiZero}
// ];