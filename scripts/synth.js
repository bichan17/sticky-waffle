app.synth = (function() {
	//globals
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


	function Synth(wavetypeControl, filterControl, delayControl, feedbackControl){
		this.wavetypeControl = wavetypeControl;
		this.filterControl = filterControl;
		this.delayControl = delayControl;
		this.feedbackControl = feedbackControl;



		this.wavetype = 0;
		this.filter = 0;
		this.delay = 0.500;
		this.feedback = 0.2;
		this.nodes = {};
		
		this.setUp(this.wavetypeControl, this.filterControl, this.delayControl, this.feedbackControl);
		
	}

	Synth.prototype.setUp = function(wavetypeControl, filterControl, delayControl, feedbackControl){
		console.log("setup synth");

		this.audioContext = new webkitAudioContext();

		this.nodes.filter = this.audioContext.createBiquadFilter();
		this.nodes.volume = this.audioContext.createGainNode();
		this.nodes.delay = this.audioContext.createDelayNode();
		this.nodes.feedbackGain = this.audioContext.createGainNode();




		this.audioAnalyser = this.audioContext.createAnalyser();
		this.audioAnalyser.smoothingTimeConstant = 0.85;



		console.log(this.audioAnalyser);


		var that = this;

		wavetypeControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	that.wavetype = e.target.value;
			
		});
		filterControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	that.filter = e.target.value;
			
		});
		delayControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	that.delay = e.target.value;
			
		});
		feedbackControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	that.feedback = e.target.value;
			
		});
		window.addEventListener("keydown", function(e){
			// console.log("keydown=" + e.keyCode);
			keydown[e.keyCode] = true;
		});

		window.addEventListener("keyup", function(e){
			// console.log("keyup=" + e.keyCode);
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

		// //W
		// if(keydown[KEYBOARD.KEY_W]){

		// 	if(wOsc.sounding == false){
		// 		wOsc.oscillator = this.makeSound(this.wavetype, "W");
		// 		wOsc.sounding = true;
		// 	}
		// }else{
		// 	if(wOsc.sounding == true){
		// 		endSound(wOsc.oscillator);
		// 		wOsc.sounding = false;
		// 	}
		// }
		// //E
		// if(keydown[KEYBOARD.KEY_E]){
			
		// 	if(eOsc.sounding == false){
		// 		eOsc.oscillator = this.makeSound(this.wavetype, "E");
		// 		eOsc.sounding = true;
		// 	}
		// }else{
		// 	if(eOsc.sounding == true){
		// 		endSound(eOsc.oscillator);
		// 		eOsc.sounding = false;
		// 	}
		// }
		// //R
		// if(keydown[KEYBOARD.KEY_R]){
			
		// 	if(rOsc.sounding == false){
		// 		rOsc.oscillator = this.makeSound(this.wavetype, "R");
		// 		rOsc.sounding = true;
		// 	}
		// }else{
		// 	if(rOsc.sounding == true){
		// 		endSound(rOsc.oscillator);
		// 		rOsc.sounding = false;
		// 	}
		// }
		// //T
		// if(keydown[KEYBOARD.KEY_T]){
			
		// 	if(tOsc.sounding == false){
		// 		tOsc.oscillator = this.makeSound(this.wavetype, "T");
		// 		tOsc.sounding = true;
		// 	}
		// }else{
		// 	if(tOsc.sounding == true){
		// 		endSound(tOsc.oscillator);
		// 		tOsc.sounding = false;
		// 	}
		// }
		// //Y
		// if(keydown[KEYBOARD.KEY_Y]){
			
		// 	if(yOsc.sounding == false){
		// 		yOsc.oscillator = this.makeSound(this.wavetype, "Y");
		// 		yOsc.sounding = true;
		// 	}
		// }else{
		// 	if(yOsc.sounding == true){
		// 		endSound(yOsc.oscillator);
		// 		yOsc.sounding = false;
		// 	}
		// }


		
	}

	Synth.prototype.getAnalyser = function(){
		return this.audioAnalyser;
	}

	Synth.prototype.getByteData = function(){
		var fqArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
		this.audioAnalyser.getByteFrequencyData(fqArray);

		return fqArray;
	}

	Synth.prototype.routeSounds = function(key){
		var doc = document;

		var source = this.audioContext.createOscillator();

		source.type = parseInt(this.wavetype);
		this.nodes.filter.type = parseInt(this.filter);
		this.nodes.feedbackGain.gain.value = this.feedback;
		this.nodes.delay.delayTime.value = this.delay;
		this.nodes.volume.gain.value = 0.2;

		source.connect(this.nodes.filter);
		this.nodes.filter.connect(this.nodes.volume);
		this.nodes.filter.connect(this.nodes.delay);
		this.nodes.delay.connect(this.nodes.feedbackGain);
		this.nodes.feedbackGain.connect(this.nodes.volume);
		this.nodes.feedbackGain.connect(this.nodes.delay);
		this.nodes.volume.connect(this.audioAnalyser);
		this.audioAnalyser.connect(this.audioContext.destination);

		return source;


	}

	Synth.prototype.makeSound = function(key){
		// console.log("wavetype: "  + this.wavetype);

		// console.log("make sound: " + key);

		// console.log(Synth.audioContext);

		// var osc = this.audioContext.createOscillator();

		var osc = this.routeSounds(key);
		// console.log(this.audioAnalyser);
		// console.log(this.audioContext);


		// osc.type = parseInt(this.wavetype);
		var fq;
		if (key == "Q") fq = 261.63;
		if (key == "W") fq = 200;
		if (key == "E") fq = 300;
		if (key == "R") fq = 400;
		if (key == "T") fq = 500;
		if (key == "Y") fq = 600;

		osc.frequency.value = fq;
		// Synth.audioAnalyser.connect(aContext.destination);
		// this.audioAnalyser.connect(this.audioContext.destination);

		// osc.connect(this.audioContext.destination);

		osc.start(0);
		return osc;


	}
	function endSound(osc){
		//destroy oscillator
		if(osc){
			osc.stop(0);
		}
	}

	return{
		Synth : Synth
	}
})();