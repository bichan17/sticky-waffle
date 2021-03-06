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
		"KEY_SEMI": [186,59],
		"KEY_APOS": 222,
		key: function(n) {
            return this[Object.keys(this)[n]];
        }
	};

	//synth constructor, it gets passed the DOM elements of the controls from main
	function Synth(settings){

		var proceed = true;
		var NUM_KEYS = Object.keys(KEYBOARD).length - 1;
		var tuna;

		var alertClose = false;

		//default values for synth
		this.wavetype = "sine"; //start on sine
		this.filter = 7; //all pass filter

		this.nodeOrder = settings.order;

		

		//holds all the node objects used by synth
		nodes = {};

		//-----------------------------
    // Check Web Audio API Support
    //-----------------------------
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new window.AudioContext(); //declare audio context
        tuna = new Tuna(this.audioContext);
        //tuna effects
				nodes.delay = new tuna.Delay({
          cutoff: 22050,        //cutoff frequency of the built in highpass-filter. 20 to 22050
          bypass: 1
        });
				nodes.chorus = new tuna.Chorus({
					bypass: 1
				});
				nodes.overdrive = new tuna.Overdrive({
					algorithmIndex: 0,
					bypass: 1
				});
				nodes.convolver = new tuna.Convolver({
					impulse: "assets/impulses/ir_rev_short.wav",
					bypass: 1
				});
    } catch(e) {
        proceed = false;
        $('.alert-box').text('This website depends on technology that your browser does not support :(').css('background-color', "#CF0008");

      }
    if (proceed) {
		
			//initialize object variables
			nodes.filter = this.audioContext.createBiquadFilter();
			nodes.volume = this.audioContext.createGain();

			
			this.audioAnalyser = this.audioContext.createAnalyser();
			this.audioAnalyser.smoothingTimeConstant = 0.85;


			this.setWaveType = function(type){
				this.wavetype = type;
			}

			this.setNodeOrder = function(idArray){
				var order = [];

				for (var i = 0; i < idArray.length; i++) {
					if(idArray[i] == "delay"){
						nodes.delay.disconnect();
						order.push(nodes.delay);
					}
					if(idArray[i] == "chorus"){
						nodes.chorus.disconnect();
						order.push(nodes.chorus);
					}
					if(idArray[i] == "overdrive"){
						nodes.overdrive.disconnect();
						order.push(nodes.overdrive);
					}
					if(idArray[i] == "convolver"){
						nodes.convolver.disconnect();
						order.push(nodes.convolver);
					}
				};


				this.nodeOrder = order;

			}

			this.changeSettings = function(settings){
				for(var effect in settings){
					for(var prop in settings[effect]){
						var val = settings[effect][prop];
						nodes[effect][prop] = val;
					}
				}
			}

			var pointerEventToXY = function(e){
	      var out = {x:0, y:0};
	      if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
	        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	        out.x = touch.pageX;
	        out.y = touch.pageY;
	      } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
	        out.x = e.pageX;
	        out.y = e.pageY;
	      }
	      return out;
	    };
			//add event listeners
			window.addEventListener("keydown", function(e){
				checkAlert();
				e.preventDefault();
				keydown[e.keyCode] = true;
			});
			window.addEventListener("keyup", function(e){
				keydown[e.keyCode] = false;
			});
			var touching = false;
			$(document).on("mousedown touchstart", function(e){
				console.log("touching");
				touching = true;
			});
			$(document).on("mouseup touchend", function(e){
				if(e.type == 'touchend'){
					if(e.originalEvent.touches.length == 0){
						touching = false;
					}
				}else{
					touching = false;
				}
			});
			$(document).on("mousedown touchstart", '.keyboard span', function(e){
				checkAlert();
				keydown[parseInt(e.target.id)] = true;
			});
			$(document).on("mouseup mouseleave touchend touchleave", '.keyboard span', function(e){
				keydown[parseInt(e.target.id)] = false;
			});
			$(document).on("mouseenter touchenter", '.keyboard span', function(e){
				if (touching) {
					var pos = pointerEventToXY(e);
					var ele = document.elementFromPoint(pos.x,pos.y);
					if($(ele).is('span')){
						keydown[parseInt(ele.id)] = true;
					}
				}
			});

			// $(document).on('touchenter mousedown', '.keyboard span', function(e){
			// 	console.log("on");
			// 	checkAlert();
			// 	keydown[parseInt(e.target.id)] = true;
			// });
			// $('.keyboard span').on('touchleave touchcancel mouseleave mouseup', function(e){
			// 	var pos = pointerEventToXY(e);
			// 	var ele = document.elementFromPoint(pos.x,pos.y);
			// 	console.log(e);
			// 	// if($(ele).is('span')){
			// 	// 	keydown[parseInt(ele.id)] = false;
			// 	// }
			// });

			function checkAlert(){
				if(alertClose == false){
					$(".alert-box a.close").trigger("click.fndtn.alert");
					alertClose = true;
				}
			}


			var root = 261.63;
			//calculates the freqency and builds the note objects
			function buildNotes(){
				var noteArray = [];
				var a = Math.pow(2,(1/12)); //constant
				for (var i = 0; i < NUM_KEYS; i++) {
					// fn = f0 * (a)^n 
					var fq = root * Math.pow(a, i)
					if(KEYBOARD.key(i).length){
						for (var j = 0; j < KEYBOARD.key(i).length; j++) {
							var code = KEYBOARD.key(i)[j];
							var note = new app.note.Note(fq, code, document.getElementById(KEYBOARD.key(i)[0]));
							noteArray.push(note);
						};
					}else{
						var code = KEYBOARD.key(i);
						var note = new app.note.Note(fq, code, document.getElementById(code));
						noteArray.push(note);
					}
				};
				return noteArray;
			}
			this.notes = buildNotes();
		} //end proceed
	}//end constructor

	//route sounds to apply the node settings
	Synth.prototype.routeSounds = function(){
		var source = this.audioContext.createOscillator();
		
		source.type = this.wavetype;

		nodes.filter.type = this.filter; //allpass filter
		nodes.volume.gain.value = 0.2; //overall volume
		source.connect(nodes.filter)

		for (var i = 0; i < this.nodeOrder.length; i++) {
			if(i==0){
				nodes.filter.connect(this.nodeOrder[i].input);
				this.nodeOrder[i].connect(this.nodeOrder[i+1].input);
			}else if (i == this.nodeOrder.length-1){
				this.nodeOrder[i].connect(nodes.volume);
			}else{
				this.nodeOrder[i].connect(this.nodeOrder[i+1].input);
			}
		};

		nodes.volume.connect(this.audioAnalyser);
		this.audioAnalyser.connect(this.audioContext.destination);

		return source;


	}
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