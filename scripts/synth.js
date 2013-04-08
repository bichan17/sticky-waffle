app.synth = (function() {
	//globals
	var keydown = []; //key daemon
	var KEYBOARD = {
		"KEY_A": 65,
		"KEY_W": 87,
		"KEY_S": 83,
		"KEY_E": 69,
		"KEY_D": 68,
		"KEY_F": 70,
		"KEY_T": 84,
		"KEY_G": 71,
		"KEY_Y": 89,
		"KEY_H": 72,
		"KEY_U": 85,
		"KEY_J": 74,
		"KEY_K": 75,
		"KEY_O": 79,
		"KEY_L": 76,
		"KEY_P": 80,
		"KEY_SEMI": 186,
		"KEY_APOS": 222,

	};
	var aOsc = {
		sounding : false,
		note : "C4",
		fq : 261.63
	};
	var wOsc = {
		sounding : false,
		note : "C4#",
		fq : 277.18
	};
	var sOsc = {
		sounding : false,
		note : "D4",
		fq : 293.66
	};
	var eOsc = {
		sounding : false,
		note : "D4#",
		fq : 311.13
	};
	var dOsc = {
		sounding : false,
		note : "E4",
		fq : 329.63
	};
	var fOsc = {
		sounding : false,
		note : "F4",
		fq : 349.23
	};
	var tOsc = {
		sounding : false,
		note : "F4#",
		fq : 369.99
	};
	var gOsc = {
		sounding : false,
		note : "G4",
		fq : 392.00
	};
	var yOsc = {
		sounding : false,
		note : "G4#",
		fq : 415.30
	};
	var hOsc = {
		sounding : false,
		note : "A4",
		fq : 440.00
	};
	var uOsc = {
		sounding : false,
		note : "A4#",
		fq : 466.16
	};
	var jOsc = {
		sounding : false,
		note : "B4",
		fq : 493.88
	};
	var kOsc = {
		sounding : false,
		note : "C5",
		fq : 523.25
	};
	var oOsc = {
		sounding : false,
		note : "C5#",
		fq : 554.37
	};
	var lOsc = {
		sounding : false,
		note : "D5",
		fq : 587.33
	};
	var pOsc = {
		sounding : false,
		note : "D5#",
		fq : 622.25
	};
	var semiOsc = {
		sounding : false,
		note : "E5",
		fq : 659.26
	};
	var aposOsc = {
		sounding : false,
		note : "F5",
		fq : 698.46
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



		// console.log(this.audioAnalyser);


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



		//A

		//A key is pressed
		if(keydown[KEYBOARD.KEY_A]){
			//A key is not making sound
			if(aOsc.sounding == false){
				//make sound, save web audio oscillator object into aOsc object
				aOsc.oscillator = this.makeSound(aOsc.fq);
				//set sounding to true so we only make one oscillator
				aOsc.sounding = true;

			}
		}else{
			//A key is not pressed

			//if A was just making noise, turn it off
			if(aOsc.sounding == true){
				//pass web audio oscillator to the endSound function
				endSound(aOsc.oscillator);
				//q is no longer making sound, so set sounding to false
				aOsc.sounding = false;
			}
		}

		//W
		if(keydown[KEYBOARD.KEY_W]){

			if(wOsc.sounding == false){
				wOsc.oscillator = this.makeSound(wOsc.fq);
				wOsc.sounding = true;
			}
		}else{
			if(wOsc.sounding == true){
				endSound(wOsc.oscillator);
				wOsc.sounding = false;
			}
		}
		//S
		if(keydown[KEYBOARD.KEY_S]){

			if(sOsc.sounding == false){
				sOsc.oscillator = this.makeSound(sOsc.fq);
				sOsc.sounding = true;
			}
		}else{
			if(sOsc.sounding == true){
				endSound(sOsc.oscillator);
				sOsc.sounding = false;
			}
		}
		//E
		if(keydown[KEYBOARD.KEY_E]){

			if(eOsc.sounding == false){
				eOsc.oscillator = this.makeSound(eOsc.fq);
				eOsc.sounding = true;
			}
		}else{
			if(eOsc.sounding == true){
				endSound(eOsc.oscillator);
				eOsc.sounding = false;
			}
		}
		//D
		if(keydown[KEYBOARD.KEY_D]){

			if(dOsc.sounding == false){
				dOsc.oscillator = this.makeSound(dOsc.fq);
				dOsc.sounding = true;
			}
		}else{
			if(dOsc.sounding == true){
				endSound(dOsc.oscillator);
				dOsc.sounding = false;
			}
		}
		//F
		if(keydown[KEYBOARD.KEY_F]){

			if(fOsc.sounding == false){
				fOsc.oscillator = this.makeSound(fOsc.fq);
				fOsc.sounding = true;
			}
		}else{
			if(fOsc.sounding == true){
				endSound(fOsc.oscillator);
				fOsc.sounding = false;
			}
		}
		//T
		if(keydown[KEYBOARD.KEY_T]){

			if(tOsc.sounding == false){
				tOsc.oscillator = this.makeSound(tOsc.fq);
				tOsc.sounding = true;
			}
		}else{
			if(tOsc.sounding == true){
				endSound(tOsc.oscillator);
				tOsc.sounding = false;
			}
		}
		//G
		if(keydown[KEYBOARD.KEY_G]){

			if(gOsc.sounding == false){
				gOsc.oscillator = this.makeSound(gOsc.fq);
				gOsc.sounding = true;
			}
		}else{
			if(gOsc.sounding == true){
				endSound(gOsc.oscillator);
				gOsc.sounding = false;
			}
		}
		//Y
		if(keydown[KEYBOARD.KEY_Y]){

			if(yOsc.sounding == false){
				yOsc.oscillator = this.makeSound(yOsc.fq);
				yOsc.sounding = true;
			}
		}else{
			if(yOsc.sounding == true){
				endSound(yOsc.oscillator);
				yOsc.sounding = false;
			}
		}
		//H
		if(keydown[KEYBOARD.KEY_H]){

			if(hOsc.sounding == false){
				hOsc.oscillator = this.makeSound(hOsc.fq);
				hOsc.sounding = true;
			}
		}else{
			if(hOsc.sounding == true){
				endSound(hOsc.oscillator);
				hOsc.sounding = false;
			}
		}
		//U
		if(keydown[KEYBOARD.KEY_U]){

			if(uOsc.sounding == false){
				uOsc.oscillator = this.makeSound(uOsc.fq);
				uOsc.sounding = true;
			}
		}else{
			if(uOsc.sounding == true){
				endSound(uOsc.oscillator);
				uOsc.sounding = false;
			}
		}
		//J
		if(keydown[KEYBOARD.KEY_J]){

			if(jOsc.sounding == false){
				jOsc.oscillator = this.makeSound(jOsc.fq);
				jOsc.sounding = true;
			}
		}else{
			if(jOsc.sounding == true){
				endSound(jOsc.oscillator);
				jOsc.sounding = false;
			}
		}
		//K
		if(keydown[KEYBOARD.KEY_K]){

			if(kOsc.sounding == false){
				kOsc.oscillator = this.makeSound(kOsc.fq);
				kOsc.sounding = true;
			}
		}else{
			if(kOsc.sounding == true){
				endSound(kOsc.oscillator);
				kOsc.sounding = false;
			}
		}
		//O
		if(keydown[KEYBOARD.KEY_O]){

			if(oOsc.sounding == false){
				oOsc.oscillator = this.makeSound(oOsc.fq);
				oOsc.sounding = true;
			}
		}else{
			if(oOsc.sounding == true){
				endSound(oOsc.oscillator);
				oOsc.sounding = false;
			}
		}
		//L
		if(keydown[KEYBOARD.KEY_L]){

			if(lOsc.sounding == false){
				lOsc.oscillator = this.makeSound(lOsc.fq);
				lOsc.sounding = true;
			}
		}else{
			if(lOsc.sounding == true){
				endSound(lOsc.oscillator);
				lOsc.sounding = false;
			}
		}
		//P
		if(keydown[KEYBOARD.KEY_P]){

			if(pOsc.sounding == false){
				pOsc.oscillator = this.makeSound(pOsc.fq);
				pOsc.sounding = true;
			}
		}else{
			if(pOsc.sounding == true){
				endSound(pOsc.oscillator);
				pOsc.sounding = false;
			}
		}
		//Semicolon
		if(keydown[KEYBOARD.KEY_SEMI]){

			if(semiOsc.sounding == false){
				semiOsc.oscillator = this.makeSound(semiOsc.fq);
				semiOsc.sounding = true;
			}
		}else{
			if(semiOsc.sounding == true){
				endSound(semiOsc.oscillator);
				semiOsc.sounding = false;
			}
		}
		//Apostrophe
		if(keydown[KEYBOARD.KEY_APOS]){

			if(aposOsc.sounding == false){
				aposOsc.oscillator = this.makeSound(aposOsc.fq);
				aposOsc.sounding = true;
			}
		}else{
			if(aposOsc.sounding == true){
				endSound(aposOsc.oscillator);
				aposOsc.sounding = false;
			}
		}
	}

	Synth.prototype.getAnalyser = function(){
		return this.audioAnalyser;
	}

	Synth.prototype.getByteData = function(){
		var fqArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
		this.audioAnalyser.getByteFrequencyData(fqArray);

		return fqArray;
	}

	Synth.prototype.routeSounds = function(){
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

	Synth.prototype.makeSound = function(fq){

		//route oscillator through nodes
		var osc = this.routeSounds();

		//change frequency
		osc.frequency.value = fq;
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