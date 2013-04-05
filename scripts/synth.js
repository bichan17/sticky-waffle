app.synth = (function() {
	//globals
	var aContext;
	var myAudioAnalyser;
	var oscillator;
	var started = false;
	var keydown = []; //key daemon
	var KEYBOARD = {
		"KEY_Q": 81,
		"KEY_W": 87,
		"KEY_E": 69,
		"KEY_R": 82,
		"KEY_T": 84,
		"KEY_Y": 89

	};
	var qOsc = {
		sounding : false
	};
	var wOsc = {
		sounding : false
	};
	var eOsc = {
		sounding : false
	};
	var rOsc = {
		sounding : false
	};
	var tOsc = {
		sounding : false
	};
	var yOsc = {
		sounding : false
	};


	function Synth(startButton, stopButton, frequencyControl, wavetypeControl){
		this.startButton = startButton;
		this.stopButton = stopButton;
		this.frequencyControl = frequencyControl;
		this.wavetypeControl = wavetypeControl;
		this.wavetype = 0;
		
		this.setUp(this.startButton, this.stopButton, this.frequencyControl, this.wavetypeControl);
		
	}

	Synth.prototype.setUp = function(startButton, stopButton, frequencyControl, wavetypeControl){
		console.log("setup synth");

		this.audioContext = new webkitAudioContext();
		this.audioAnalyser = this.audioContext.createAnalyser();

		console.log(this);
		console.log(Synth);


		console.log("this.audioContext: "+ this.audioContext);

		// aContext = new webkitAudioContext();
		// this.audioContext = aContext;
		oscillator = this.audioContext.createOscillator();

		// myAudioAnalyser = aContext.createAnalyser();
		// myAudioAnalyser.smoothingTimeConstant = 0.85;
		// myAudioAnalyser.connect(aContext.destination);
		// this.audioAnalyser = myAudioAnalyser;

		startButton.addEventListener("click", function(){
			started = true;
			startSound(wavetypeControl.value, frequencyControl.value);
		});

		stopButton.addEventListener("click", function(){
			started = false;
			stopSound();
		});


		frequencyControl.addEventListener("change", function(e){
		 	 document.querySelector("#frequencyControlResults").innerHTML = e.target.value;
		 	 startSound(wavetypeControl.value, e.target.value);
			
		 });

		var that = this;

		wavetypeControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	that.wavetype = e.target.value;
		 	 
		 	 startSound(e.target.value, frequencyControl.value);
			
		 });
		window.addEventListener("keydown", function(e){
			console.log("keydown=" + e.keyCode);
			keydown[e.keyCode] = true;
		});

		window.addEventListener("keyup", function(e){
			console.log("keyup=" + e.keyCode);
			keydown[e.keyCode] = false;
		});

		
	}


	Synth.prototype.update = function(){
		//Q

		//Q key is pressed
		if(keydown[KEYBOARD.KEY_Q]){
			//Q key is not making sound
			if(qOsc.sounding == false){
				//make sound, save web audio oscillator object into qOsc object
				qOsc.oscillator = this.makeSound(this.wavetype, "Q");
				//set sounding to true so we only make one oscillator
				qOsc.sounding = true;
			}
		}else{
			//Q key is not pressed

			//if Q was just making noise, turn it off
			if(qOsc.sounding == true){
				//pass web audio oscillator to the endSound function
				endSound(qOsc.oscillator);
				//q is no longer making sound, so set sounding to false
				qOsc.sounding = false;
			}
		}
		//W
		if(keydown[KEYBOARD.KEY_W]){

			if(wOsc.sounding == false){
				wOsc.oscillator = this.makeSound(this.wavetype, "W");
				wOsc.sounding = true;
			}
		}else{
			if(wOsc.sounding == true){
				endSound(wOsc.oscillator);
				wOsc.sounding = false;
			}
		}
		//E
		if(keydown[KEYBOARD.KEY_E]){
			
			if(eOsc.sounding == false){
				eOsc.oscillator = this.makeSound(this.wavetype, "E");
				eOsc.sounding = true;
			}
		}else{
			if(eOsc.sounding == true){
				endSound(eOsc.oscillator);
				eOsc.sounding = false;
			}
		}
		//R
		if(keydown[KEYBOARD.KEY_R]){
			
			if(rOsc.sounding == false){
				rOsc.oscillator = this.makeSound(this.wavetype, "R");
				rOsc.sounding = true;
			}
		}else{
			if(rOsc.sounding == true){
				endSound(rOsc.oscillator);
				rOsc.sounding = false;
			}
		}
		//T
		if(keydown[KEYBOARD.KEY_T]){
			
			if(tOsc.sounding == false){
				tOsc.oscillator = this.makeSound(this.wavetype, "T");
				tOsc.sounding = true;
			}
		}else{
			if(tOsc.sounding == true){
				endSound(tOsc.oscillator);
				tOsc.sounding = false;
			}
		}
		//Y
		if(keydown[KEYBOARD.KEY_Y]){
			
			if(yOsc.sounding == false){
				yOsc.oscillator = this.makeSound(this.wavetype, "Y");
				yOsc.sounding = true;
			}
		}else{
			if(yOsc.sounding == true){
				endSound(yOsc.oscillator);
				yOsc.sounding = false;
			}
		}
		
	}

	Synth.prototype.getFrequencyVal = function(){
		return this.frequencyControl.value;
	}
	Synth.prototype.getAnalyser = function(){
		return this.audioAnalyser;
	}
	Synth.prototype.getArrayBuffer = function(){
		return this.audioAnalyser;
	}

	Synth.prototype.makeSound = function(butttype, key){
		console.log("wavetype: "  + this.wavetype);

		console.log("make sound: " + key);

		console.log(Synth.audioContext);

		var osc = this.audioContext.createOscillator();

		osc.type = parseInt(this.wavetype);
		var fq;
		if (key == "Q") fq = 100;
		if (key == "W") fq = 200;
		if (key == "E") fq = 300;
		if (key == "R") fq = 400;
		if (key == "T") fq = 500;
		if (key == "Y") fq = 600;

		osc.frequency.value = fq;
		// Synth.audioAnalyser.connect(aContext.destination);
		console.log("buffer: " + osc.buffer);
		osc.connect(this.audioContext.destination);
		osc.start(0);
		return osc;



	}
	function endSound(osc){
		//destroy oscillator
		if(osc){
			osc.stop(0);
		}
	}

	function startSound(wavetype, fq){
		console.log("start");
		if(started == true){
			oscillator.type = parseInt(wavetype);
			oscillator.frequency.value = fq;
			oscillator.connect(Synth.audioContext.destination);
			myAudioAnalyser.connect(Synth.audioContext.destination);
			oscillator.start(0);
		}
	}
	function stopSound(){
		console.log("stop");

		oscillator.stop(0);
		oscillator = Synth.audioContext.createOscillator();
	}

	return{
		Synth : Synth
	}
})();