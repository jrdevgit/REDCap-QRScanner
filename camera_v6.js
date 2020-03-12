
QRScanner.videoIDs = [];
QRScanner.labelIDs = [];
QRScanner.buttonIDs = [];
QRScanner.collapseIDs = [];
QRScanner.numberIDs = [];
QRScanner.isCameraOn = [];

QRScanner.videoID = 'QrScannerVideo-';
QRScanner.labelID = 'QrScannerLabel-';
QRScanner.buttonID = 'QrScannerBtn-';
QRScanner.collapseID = 'QrScannerCol-';

QRScanner.isMasterCameraOn = false;
QRScanner.currentCamera;
QRScanner.previousCamera;
QRScanner.interruption;
QRScanner.index = 0;
QRScanner.cameraLoaded = true;


QRScanner.resetPreviousCamera = function() {
	$.each(QRScanner.isCameraOn, function(i, row) {
		if (QRScanner.numberIDs[i] == QRScanner.previousCamera) {
			QRScanner.isCameraOn[i] = false;
			return;
		}
	})
}

QRScanner.activateCamera = function(i, codeReader, selectedDeviceId) {
	if (QRScanner.cameraLoaded) {
		if (QRScanner.isMasterCameraOn !== true) {
			codeReader.reset()
			$(".QRScanner-camera").collapse('hide');
			QRScanner.isCameraOn[i] = true;
			$("#"+QRScanner.collapseIDs[i]).collapse('show');
			QRScanner.temporarilyDisableButtons(codeReader, selectedDeviceId);
			QRScanner.decodeOnce(codeReader, selectedDeviceId, QRScanner.videoIDs[i], QRScanner.buttonIDs[i], QRScanner.fields[i], QRScanner.collapseIDs[i], QRScanner.numberIDs[i], i);
			console.log(`Started decode from camera with id ${selectedDeviceId}`);

		} else {
			codeReader.reset()
			$(".QRScanner-camera").collapse('hide');
			QRScanner.temporarilyDisableButtons(codeReader, selectedDeviceId);
			if (QRScanner.isCameraOn[i] == null || QRScanner.isCameraOn[i] == false) {
				QRScanner.isCameraOn[i] = true;
				QRScanner.interruption = true;
				$("#"+QRScanner.collapseIDs[i]).collapse('show');
				QRScanner.decodeOnce(codeReader, selectedDeviceId, QRScanner.videoIDs[i], QRScanner.buttonIDs[i], QRScanner.fields[i], QRScanner.collapseIDs[i], QRScanner.numberIDs[i],i);
				console.log(`Started decode from camera with id ${selectedDeviceId}`);
				
			} else {
				QRScanner.temporarilyDisableButtons(codeReader, selectedDeviceId);
				QRScanner.isCameraOn[i] = false;
			};

		};
	} else {
		event.preventDefault();
	}
}

QRScanner.temporarilyDisableButtons = function(codeRead, selectedDeviceId) {
	QRScanner.cameraLoaded = false;
	$('.QRScanner-button').attr('disabled', '');
	
	setTimeout(function() {
		$('.QRScanner-button').removeAttr('disabled');
		QRScanner.cameraLoaded = true;
	},750)
}
			
QRScanner.decodeOnce = function(codeRead, selectedDeviceId, videoID, buttonID, outputName, collapseID, newCamera, currentI) {	  
	if (QRScanner.currentCamera !== newCamera) {
		QRScanner.previousCamera = QRScanner.currentCamera;
		QRScanner.currentCamera = newCamera;
		if (QRScanner.previousCamera == null) {
			QRScanner.previousCamera = QRScanner.currentCamera;
		}
	} 
	let blocked = false;
	let startsWithVal;
	let textLengthVal;
	QRScanner.isMasterCameraOn = true;
	  
    codeRead.decodeFromInputVideoDevice(selectedDeviceId, videoID).then((result) => {
		console.log(result);
		function checkNull(val) {
			return val == null;
		}
		if (QRScanner.startsVal[currentI].every(checkNull)) {
			startsWithVal = true;
		} else {
			$.each(QRScanner.startsVal[currentI], function(i, val){
				if (val == 'null'){
					return
				} else {
					if (result.text.startsWith(val)) {
						startsWithVal = true;
						return false;
					}
				}
			})
		}
		if (QRScanner.lengthVal[currentI] == null) {
			textLengthVal = true;
		} else {
			if (result.text.length == parseInt(QRScanner.lengthVal[currentI])) {
				textLengthVal = true;
			}
		}
		if (startsWithVal && textLengthVal) {
			QRScanner.previousOutput = document.getElementsByName(outputName)[0].value;
			document.getElementsByName(outputName)[0].value = result.text;
			doBranching(outputName);
			if (QRScanner.previousOutput !== document.getElementsByName(outputName)[0].value && QRScanner.time[currentI] !== null) {
				QRScanner.enterTime(outputName, QRScanner.time[currentI]);
				doBranching(QRScanner.time[currentI]);
			}
			codeRead.reset();
			$('#'+collapseID).collapse('hide');
			QRScanner.isMasterCameraOn = false;;
			
			$.each(QRScanner.isCameraOn, function(i, row) {
				QRScanner.isCameraOn[i] = false;
			})
		} else {
			if (!startsWithVal) {
				let startsWithError = '';
				if (QRScanner.startsVal[currentI].length > 1) {
					for(i = 1; i < QRScanner.startsVal[currentI].length; i++) {
						startsWithError += ' or ' + QRScanner.startsVal[currentI][i];
					}
				}
				startsWithError = 'The decoded text does not start with ' + QRScanner.startsVal[currentI][0] + startsWithError + '!';
				alert(startsWithError);
			}
			if (!textLengthVal) {
				let textLengthError = 'The decoded text does not have length = ' + QRScanner.lengthVal[0] +'!';
				alert(textLengthError);
			}
			codeRead.reset();
			QRScanner.temporarilyDisableButtons(codeRead, selectedDeviceId)
			QRScanner.decodeOnce(codeRead, selectedDeviceId, videoID, buttonID, outputName, collapseID, newCamera, currentI);
		}
    }).catch((err) => {
        console.error(err);
		if (String(err).includes("denied") || String(err).includes("dismissed")) {
			blocked = true;
		}
		//If turning off the same camera that is turned on
		if (QRScanner.previousCamera == QRScanner.currentCamera || blocked == true) {
			QRScanner.isMasterCameraOn = false;
			$.each(QRScanner.isCameraOn, function(i, row) {
				QRScanner.isCameraOn[i] = false;
			})
		$(".QRScanner-camera").collapse('hide');
		QRScanner.previousCamera = QRScanner.currentCamera;
		}
		//If turning off a different camera that is being turned on
		if (QRScanner.previousCamera !== QRScanner.currentCamera && blocked == false) {
			//Due to interruption, i.e. turning on a new camera WHILE the previous camera was still on
			if (QRScanner.interruption) {
				QRScanner.resetPreviousCamera();
				$('#'+collapseID).attr('class', 'collapse');
				//Not interruption, i.e. turning on a new camera that is different to the previous camera
			} else {
				QRScanner.isMasterCameraOn = false;
				$.each(QRScanner.isCameraOn, function(i, row) {
					QRScanner.isCameraOn[i] = false;
				})
				QRScanner.previousCamera = QRScanner.currentCamera;
			}
		
			QRScanner.interruption = false;
		}
	})
}

QRScanner.enterTime = function(cameraField, timeField) {
	if (document.getElementsByName(cameraField)[0].value == '') {
		document.getElementsByName(timeField)[0].value = '';
	} else {
		let today = new Date();
		let smallDates = [today.getMonth()+1, today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()];
		$.each(smallDates, function(i, field) {
			if (smallDates[i] < 10) {
				smallDates[i] = '0'+String(field);
			}
		})
		let date = today.getFullYear()+'-'+smallDates[0]+'-'+smallDates[1];
		let time = smallDates[2] + ":" + smallDates[3] + ":" + smallDates[4];
		let dateTime = date+' '+time;		
		document.getElementsByName(timeField)[0].value = dateTime;
	}
}

window.addEventListener('load', function () {
	$.each(QRScanner.fields, function(i, field) {
		QRScanner.videoIDs[i] = QRScanner.videoID + field;
		QRScanner.labelIDs[i]= QRScanner.labelID + field;
		QRScanner.buttonIDs[i] = QRScanner.buttonID +  field;
		QRScanner.collapseIDs[i] = QRScanner.collapseID + field;
		QRScanner.numberIDs[i] = QRScanner.index;
		QRScanner.isCameraOn[i]= false;
		$(`<p id = ${QRScanner.labelIDs[i]}><br></p>`).insertBefore(`input[name=${QRScanner.fields[i]}]`);
		$("#"+QRScanner.labelIDs[i]).append(`<button type='button' class='btn btn-info QRScanner-button' id=${QRScanner.buttonIDs[i]}>Activate Scanner</button>`);
		$("#"+QRScanner.labelIDs[i]).append("<br>");
		$("#"+QRScanner.labelIDs[i]).append(`<div id=${QRScanner.collapseIDs[i]} class='collapse QRScanner-camera'><main class='wrapper' style='padding-top:2em'><div><video id=${QRScanner.videoIDs[i]} width=${QRScanner.widths[i]} height=${QRScanner.heights[i]} style='border: 1px solid gray'></video></div></main></div>`);
		QRScanner.index += 1;
	})
	if (QRScanner.isSurvey) {
		$('#'+QRScanner.camera+'-tr').find('td').eq(1).append('<div id="QRScanner-sourceSelectPanel" style="display:none"><label for="QRScanner-sourceSelect">Change video source:</label><select id="QRScanner-sourceSelect" style="max-width:400px"></select></div>');
	} else {
			$('#'+QRScanner.camera+'-tr').find('td').eq(0).append('<div id="QRScanner-sourceSelectPanel" style="display:none"><label for="QRScanner-sourceSelect">Change video source:</label><select id="QRScanner-sourceSelect" style="max-width:400px"></select></div>');
	}
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserQRCodeReader();
    console.log('ZXing code reader initialized');


    codeReader.getVideoInputDevices().then((videoInputDevices) => {
		var sourceSelect = document.getElementById('QRScanner-sourceSelect');
		selectedDeviceId = videoInputDevices[0].deviceId;
		if (videoInputDevices.length >= 1) {
			videoInputDevices.forEach((element) => {
				var sourceOption = document.createElement('option');
				sourceOption.text = element.label;
				sourceOption.value = element.deviceId;
				sourceSelect.appendChild(sourceOption);
			})
			document.getElementById('QRScanner-sourceSelect').options[0].setAttribute('selected','');
			sourceSelect.onchange = () => {
				selectedDeviceId = sourceSelect.value;
			};
			if (videoInputDevices.length >= 2) {
				//Mobile devices should have at least 2 cameras (1 front camera and 1 back camera).
				sourceSelect.value = document.getElementById('QRScanner-sourceSelect').options[1].value
				document.getElementById('QRScanner-sourceSelect').options[1].setAttribute('selected','')
				selectedDeviceId = document.getElementById('QRScanner-sourceSelect').options[1].value
				//In most cases the second option is the back camera
			}
			
			var sourceSelectPanel = document.getElementById('QRScanner-sourceSelectPanel');
			sourceSelectPanel.style.display = 'block';
		}
		$.each(QRScanner.fields, function(i, field) {
			document.getElementById(QRScanner.buttonIDs[i]).addEventListener('click', function() {QRScanner.activateCamera(i,codeReader, selectedDeviceId)});
			document.getElementsByName(QRScanner.fields[i])[0].addEventListener("focus", function() {
				QRScanner.previousOutput = document.getElementsByName(QRScanner.fields[i])[0].value;
			})
		})
	})
})
	