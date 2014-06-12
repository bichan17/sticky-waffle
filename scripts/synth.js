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
		"KEY_APOS": 222
	};
	// this array holds all of the sounds we make
	var oscArray = [
		{
			sounding : false,
			note : "C4",
			fq : 261.63,
			key : KEYBOARD["KEY_A"]
		},
		{
			sounding : false,
			note : "C4#",
			fq : 277.18,
			key : KEYBOARD["KEY_W"]
		},
		{
			sounding : false,
			note : "D4",
			fq : 293.66,
			key : KEYBOARD["KEY_S"]
		},
		{
			sounding : false,
			note : "D4#",
			fq : 311.13,
			key : KEYBOARD["KEY_E"]
		},
		{
			sounding : false,
			note : "E4",
			fq : 329.63,
			key : KEYBOARD["KEY_D"]
		},
		{
			sounding : false,
			note : "F4",
			fq : 349.23,
			key : KEYBOARD["KEY_F"]
		},
		{
			sounding : false,
			note : "F4#",
			fq : 369.99,
			key : KEYBOARD["KEY_T"]
		},
		{
			sounding : false,
			note : "G4",
			fq : 392.00,
			key : KEYBOARD["KEY_G"]
		},
		{
			sounding : false,
			note : "G4#",
			fq : 415.30,
			key : KEYBOARD["KEY_Y"]
		},
		{
			sounding : false,
			note : "A4",
			fq : 440.00,
			key : KEYBOARD["KEY_H"]
		},
		{
			sounding : false,
			note : "A4#",
			fq : 466.16,
			key : KEYBOARD["KEY_U"]
		},
		{
			sounding : false,
			note : "B4",
			fq : 493.88,
			key : KEYBOARD["KEY_J"]
		},
		{
			sounding : false,
			note : "C5",
			fq : 523.25,
			key : KEYBOARD["KEY_K"]
		},
		{
			sounding : false,
			note : "C5#",
			fq : 554.37,
			key : KEYBOARD["KEY_O"]
		},
		{
			sounding : false,
			note : "D5",
			fq : 587.33,
			key : KEYBOARD["KEY_L"]
		},
		{
			sounding : false,
			note : "D5#",
			fq : 622.25,
			key : KEYBOARD["KEY_P"]
		},

		{
			sounding : false,
			note : "E5",
			fq : 659.26,
			key : KEYBOARD["KEY_SEMI"]
		},
		{
			sounding : false,
			note : "F5",
			fq : 698.46,
			key : KEYBOARD["KEY_APOS"]
		}
	];
	// console.log(oscArray);




	//synth constructor, it gets passed the DOM elements of the controls from main
	function Synth(wavetypeControl, delayControl, feedbackControl){

		this.proceed = true;

		//default values for synth
		this.wavetype = 0;
		this.filter = 7; //all pass filter
		this.delay = 0.200;
		this.feedback = 0;

		//holds all the node objects used by synth
		this.nodes = {};

		//-----------------------------
    // Check Web Audio API Support
    //-----------------------------
    try {
        // More info at http://caniuse.com/#feat=audio-api
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new window.AudioContext(); //declare audio context
    } catch(e) {
        this.proceed = false;
        alert('Web Audio API not supported in this browser :(');
    }

    if (this.proceed) {
		
			//initialize object variables
			console.log("setup Synth");

			this.nodes.filter = this.audioContext.createBiquadFilter();
			this.nodes.volume = this.audioContext.createGain();
			this.nodes.delay = this.audioContext.createDelay();
			this.nodes.feedbackGain = this.audioContext.createGain();




			this.audioAnalyser = this.audioContext.createAnalyser();
			this.audioAnalyser.smoothingTimeConstant = 0.85;



			//add event listeners
			var that = this;

			wavetypeControl.addEventListener("change", function(e){
				that.wavetype = e.target.value;
			});
			delayControl.addEventListener("change", function(e){
				that.delay = e.target.value;
			});
			feedbackControl.addEventListener("change", function(e){
				that.feedback = e.target.value;
			});
			window.addEventListener("keydown", function(e){
				e.preventDefault();
				keydown[e.keyCode] = true;
			});

			window.addEventListener("keyup", function(e){
				keydown[e.keyCode] = false;
			});

			//add DOM element of each key to their objects
			for (var i = 0; i < oscArray.length; i++) {
				oscArray[i].keyDisplay = document.getElementById(oscArray[i].key);
			}
		}
	}

	Synth.prototype.update = function(){

		//check if a key is pressed, make a sound
		for (var i = 0; i < oscArray.length; i++) {
			if(keydown[oscArray[i].key]){
				//A key is not making sound
				if(oscArray[i].sounding == false){
					//make sound, save web audio oscillator object into osc object
					oscArray[i].oscillator = this.makeSound(oscArray[i].fq);
					oscArray[i].keyDisplay.className+= "played";
					//set sounding to true so we only make one oscillator
					oscArray[i].sounding = true;

				}
			}else{
				//the key is not pressed

				//if a node was just making noise, turn it off
				if(oscArray[i].sounding == true){
					//pass web audio oscillator to the endSound function
					endSound(oscArray[i].oscillator);
					oscArray[i].keyDisplay.className = '';
					//q is no longer making sound, so set sounding to false
					oscArray[i].sounding = false;
				}
			}	
		} // end for loop

	} // end update


	//returns analyser node for the visualizer to use
	Synth.prototype.getAnalyser = function(){
		return this.audioAnalyser;
	}
	//returns byteData array for the visualizer to use
	Synth.prototype.getByteData = function(){
		var fqArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
		this.audioAnalyser.getByteFrequencyData(fqArray);

		return fqArray;
	}

	//route sounds to apply the node settings
	Synth.prototype.routeSounds = function(){
		var doc = document;

		var source = this.audioContext.createOscillator();

		source.type = parseInt(this.wavetype);
		this.nodes.filter.type = 7; //allpass filter
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


	//makes the sound
	Synth.prototype.makeSound = function(fq){

		//route oscillator through nodes
		var osc = this.routeSounds();

		//change frequency
		osc.frequency.value = fq;
		if (osc.start) {
			osc.start(0);

		}else{
			osc.noteOn(0);
		}
		

		//return the osc so we can stop it later
		return osc;

	}
	function endSound(osc){
		//destroy oscillator
		if(osc){
			if(osc.stop){
				osc.stop(0);
			}else{
				osc.noteOff(0);
			}
		}
	}

	return{
		Synth : Synth
	}
})();