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
		key: function(n) {
            return this[Object.keys(this)[n]];
        }
	};

	//synth constructor, it gets passed the DOM elements of the controls from main
	function Synth(){

		var proceed = true;
		var NUM_KEYS = Object.keys(KEYBOARD).length - 1;

		//default values for synth
		this.wavetype = 0; //start on sine
		this.delay = 0.200;
		this.feedback = 0;
		this.filter = 7; //all pass filter
		

		//holds all the node objects used by synth
		nodes = {};

		//-----------------------------
    // Check Web Audio API Support
    //-----------------------------
    try {
        // More info at http://caniuse.com/#feat=audio-api
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new window.AudioContext(); //declare audio context
    } catch(e) {
        proceed = false;
        alert('This website depends on technology that your browser does not support :(');
    }

    if (proceed) {
		
			//initialize object variables
			nodes.filter = this.audioContext.createBiquadFilter();
			nodes.volume = this.audioContext.createGain();
			nodes.delay = this.audioContext.createDelay();
			nodes.feedbackGain = this.audioContext.createGain();
			this.audioAnalyser = this.audioContext.createAnalyser();
			this.audioAnalyser.smoothingTimeConstant = 0.85;


			this.setWaveType = function(type){
				this.wavetype = type;
			}
			this.setDelay = function(delay){
				this.delay = delay;
			}
			this.setFeedback = function(fb){
				this.feedback = fb;
			}
			//add event listeners
			window.addEventListener("keydown", function(e){
				e.preventDefault();
				keydown[e.keyCode] = true;
			});

			window.addEventListener("keyup", function(e){
				keydown[e.keyCode] = false;
			});


			var root = 261.63;



			//calculates the freqency and builds the note objects
			function buildNotes(){
				var noteArray = [];
				var a = Math.pow(2,(1/12)); //constant
				for (var i = 0; i < NUM_KEYS; i++) {
					// fn = f0 * (a)^n 
					var fq = root * Math.pow(a, i)
					var note = new app.note.Note(fq, KEYBOARD.key(i));
					noteArray.push(note);
				};

				return noteArray;
			}
			this.notes = buildNotes();



			

			//add DOM element of each key to their objects
			for (var i = 0; i < this.notes.length; i++) {
				this.notes[i].keyDisplay = document.getElementById(this.notes[i].key);
			}

			//route sounds to apply the node settings
			this.routeSounds = function(){
				var source = this.audioContext.createOscillator();

				source.type = parseInt(this.wavetype);
				nodes.filter.type = this.filter; //allpass filter
				nodes.feedbackGain.gain.value = this.feedback;
				nodes.delay.delayTime.value = this.delay;
				nodes.volume.gain.value = 0.2;

				source.connect(nodes.filter);
				nodes.filter.connect(nodes.volume);
				nodes.filter.connect(nodes.delay);
				nodes.delay.connect(nodes.feedbackGain);
				nodes.feedbackGain.connect(nodes.volume);
				nodes.feedbackGain.connect(nodes.delay);
				nodes.volume.connect(this.audioAnalyser);
				this.audioAnalyser.connect(this.audioContext.destination);

				return source;


			}
		} //end proceed
	}//end constructor

	Synth.prototype.update = function(){

		//check if a key is pressed, make a sound
		for (var i = 0; i < this.notes.length; i++) {
			if(keydown[this.notes[i].key]){
				//A key is not making sound
				if(this.notes[i].sounding == false){
					//make sound, save web audio oscillator object into osc object
					this.notes[i].oscillator = this.makeSound(this.notes[i].fq);
					this.notes[i].keyDisplay.className+= "played";
					//set sounding to true so we only make one oscillator
					this.notes[i].sounding = true;

				}
			}else{
				//the key is not pressed

				//if a node was just making noise, turn it off
				if(this.notes[i].sounding == true){
					//pass web audio oscillator to the endSound function
					endSound(this.notes[i].oscillator);
					this.notes[i].keyDisplay.className = '';
					//q is no longer making sound, so set sounding to false
					this.notes[i].sounding = false;
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




	//makes the sound
	Synth.prototype.makeSound = function(fq){

		//route oscillator thru nodes
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