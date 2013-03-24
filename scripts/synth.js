app.synth = (function() {
	//globals
	var aContext;
	var oscillator;
	var started = false;

	function Synth(startButton, stopButton, frequencyControl, wavetypeControl){
		this.startButton = startButton;
		this.stopButton = stopButton;
		this.frequencyControl = frequencyControl;
		this.wavetypeControl = wavetypeControl;
		this.setUp(this.startButton, this.stopButton, this.frequencyControl, this.wavetypeControl);
	}

	Synth.prototype.setUp = function(startButton, stopButton, frequencyControl, wavetypeControl){
		console.log("setup synth");
		aContext = new webkitAudioContext();
		oscillator = aContext.createOscillator();

		startButton.addEventListener("click", function(){
			started = true;
			startSound(wavetypeControl.value, frequencyControl.value);
		});

		stopButton.addEventListener("click", function(){
			started = false;
			stopSound();
		});

		// fqDisplay = document.querySelector("#frequencyControlResults").innerHTML;

		// console.log(fqDisplay);

		frequencyControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	 document.querySelector("#frequencyControlResults").innerHTML = e.target.value;
		 	 startSound(wavetypeControl.value, e.target.value);
			
		 });

		wavetypeControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	 
		 	 startSound(e.target.value, frequencyControl.value);
			
		 });
		
	}

	Synth.prototype.getFrequencyVal = function(){
		return this.frequencyControl.value;
	}

	function startSound(wavetype, fq){
		console.log("start");
		if(started == true){
			oscillator.type = wavetype;
			oscillator.frequency.value = fq;
			oscillator.connect(aContext.destination);
			oscillator.start(0);
		}
	}
	function stopSound(){
		console.log("stop");

		oscillator.stop(0);
		oscillator = aContext.createOscillator();
	}

	return{
		Synth : Synth
	}
})();