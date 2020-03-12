# REDCap-QRScanner

## Description

This External Module allows QR codes to be scanned and have the decoded text returned into a text field.

The module attaches a button on top of selected text fields:

![QrScanner_example](/img/QrScanner_example.PNG) 

When the button is clicked, a QrScanner will be displayed using your device's inbuild camera, which will decode a QR code that it finds and return it in the associated text field. 

![QrScanner_on_example](/img/QrScanner_working_example.PNG)

Multiple QrScanners can be added on the same page, as long as there is a camera selection field on the same page. Once turned on, the QrScanner can be turned off manually by clicking on its button again.

Make sure to allow camera access in your browser settings.

This module uses the ZXing library for decoding QR codes: https://github.com/zxing-js/library

## Configuration

* **Select which instrument to add the scanner functionality:**
	There is no limit on how many instruments can have the scanner functionality, however within each instrument, all QrScanner related fields must be on the same page. 
	
* **Select which descriptive field to append the camera selection (This field will NOT work with the Shazam module):**
	This field attaches a dropdown list of all the cameras on your device. This field must be a descriptive text field and must be within the selected instrument

* **Select which field to attach a QR camera (Must be a text field):**
	This field will have a button attached to it to activate the QrScanner. The decoded text will be returned to this field. 
	
* **Camera Width (px):**
	Width of the camera screen in pixels (px).
	
* **Camera Height (px):**
	Height of the camera screen in pixels (px).
	
* **Add 'startswith' validation:**
	Optional validation checks if the decoded text starts with the string specified. If not, an alert pop-up will appear to notify the user that the decoded text failed the validation. The camera will then restart.
	
* **Add length validation (Must be an integer value):**
	Optional validation checks if the decoded text has the specified length. If not, an alert pop-up will appear to notify the user that the decoded text failed the validation. The camera will then restart.
	
* **Select which field to attach the field to log the time of scanning:**
	Optional field that logs the current time when the QrScanner returns the decoded text.
	
## Limitations

The QRScanner may not work in certain browsers on certain mobile devices (The author tested that the QRScanner did not work in the Chrome browser on the iPad 7th gen, but did work in Safari). It is recommended that if you find the QRScanner to fail on your mobile device, try it in other browsers. 

	
	

