<?php

namespace MCRI\QRScanner;
use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;
use REDCap;

class QRScanner extends AbstractExternalModule {

    function redcap_data_entry_form_top($project_id, $record = null, $instrument, $event_id, $group_id = null, $repeat_instance = 1) {
		/*$this->framework->initializeJavascriptModuleObject();?>
		
		<script>
			$(function(){
				var module = <?=$this->framework->getJavascriptModuleObjectName()?>;
				module.log('Hello from JavaScript!');
			})
		</script>
		<?php*/
		$this->is_survey = false;
        $this->implementScanners($instrument);
	}

    function redcap_survey_page_top($project_id, $record = null, $instrument, $event_id, $group_id = null, $survey_hash, $response_id = null, $repeat_instance = 1) {
		/*$this->framework->initializeJavascriptModuleObject();?>
		
		<script>
			$(function(){
				var module = <?=$this->framework->getJavascriptModuleObjectName()?>;
				module.log('Hello from JavaScript!');
			})
		</script>
		<?php*/
        $this->is_survey = true;
        $this->implementScanners($instrument);
    }
	
	function implementScanners($instrument) {
		$instrument_settings = $this->getSubSettings('instrument_settings');
		foreach($instrument_settings as $instrument_setting) {
			if ($instrument_setting['scanner_instrument'] === $instrument) {
				$scanner_camera = $instrument_setting['scanner_camera'];
				$instrument_fields = REDCap::getFieldNames($instrument);
				$scanner_settings = $this->getSubSettings('scanner_settings');
				$scanner_fields = [];
				$scanner_width = [];
				$scanner_height = [];
				$scanner_startswith_validations = [];
				$scanner_length_validations = [];
				$scanner_times = [];
				foreach($scanner_settings as $instance) {
					if (in_array($instance['scanner_field'], $instrument_fields)) {
						$scanner_fields[] = $instance['scanner_field'];
						$scanner_width[] = $instance['scanner_width'];
						$scanner_height[] = $instance['scanner_height'];
						$scanner_startswith_validations[] = $instance['scanner_startswith'];
						$scanner_length_validations[] = $instance['scanner_length'];
						$scanner_times[] = in_array($instance['scanner_time'], $instrument_fields)?$instance['scanner_time']:null;
					}
				}
				?>
				
				<script>
					var QRScanner = QRScanner || {};
					<?php echo file_get_contents($this->getModulePath() . "zxing.js") ?>;
					QRScanner.isSurvey = <?php echo json_encode($this->is_survey)?>;
					QRScanner.camera = <?php echo json_encode($scanner_camera)?>;
					QRScanner.fields = <?php echo json_encode($scanner_fields)?>;
					QRScanner.widths = <?php echo json_encode($scanner_width)?>;
					QRScanner.heights = <?php echo json_encode($scanner_height)?>;
					QRScanner.startsVal = <?php echo json_encode($scanner_startswith_validations)?>;
					QRScanner.lengthVal = <?php echo json_encode($scanner_length_validations)?>;
					QRScanner.time = <?php echo json_encode($scanner_times)?>;
				</script>
				<script>
					<?php echo file_get_contents($this->getModulePath().'camera_v6.js')?>;
				</script>
				<?php
				break;
			}
		}
	}
}

?>
