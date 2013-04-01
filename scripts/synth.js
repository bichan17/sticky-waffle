app.synth = (function() {
	//globals
	var aContext;
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
		
		this.setUp(this.startButton, this.stopButton, this.frequencyControl, this.wavetypeControl);
		
	}

	Synth.prototype.setUp = function(startButton, stopButton, frequencyControl, wavetypeControl){
		console.log("setup synth");

		window.requestAnimFrame = (function(){
	      return  window.requestAnimationFrame       ||
	              window.webkitRequestAnimationFrame ||  
	              window.mozRequestAnimationFrame    ||  
	              window.oRequestAnimationFrame      ||  
	              window.msRequestAnimationFrame     ||  
	              function( callback ){ 
	                window.setTimeout(callback, 1000 / 60); 
	              };
	    })();

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


		Synth.wavetype = 0;

		wavetypeControl.addEventListener("change", function(e){
		 	//console.log("checked=" + e.target.value);
		 	Synth.wavetype = e.target.value;
		 	 
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

		//start loop
		loop();
		
	}

	function loop(){
		// console.log("LOOOP!");
		update();
		window.requestAnimFrame(loop);
	}

	function update(){
		//Q

		//Q key is pressed
		if(keydown[KEYBOARD.KEY_Q]){
			//Q key is not making sound
			if(qOsc.sounding == false){
				//make sound, save web audio oscillator object into qOsc object
				qOsc.oscillator = makeSound(Synth.wavetype, "Q");
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
				wOsc.oscillator = makeSound(Synth.wavetype, "W");
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
				eOsc.oscillator = makeSound(Synth.wavetype, "E");
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
				rOsc.oscillator = makeSound(Synth.wavetype, "R");
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
				tOsc.oscillator = makeSound(Synth.wavetype, "T");
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
				yOsc.oscillator = makeSound(Synth.wavetype, "Y");
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

	function makeSound(wavetype, key){
		console.log("wavetype: "  + wavetype);

		console.log("make sound: " + key);

		var osc = aContext.createOscillator();
		osc.type = wavetype;
		var fq;
		if (key == "Q") fq = 100;
		if (key == "W") fq = 200;
		if (key == "E") fq = 300;
		if (key == "R") fq = 400;
		if (key == "T") fq = 500;
		if (key == "Y") fq = 600;

		osc.frequency.value = fq;
		osc.connect(aContext.destination);
		osc.start(0);
		return osc;


	}
	function endSound(osc){
		//destroy oscillator
		if(osc){
			osc.stop(0);
		}
		else{
			console.log("WAT");
		}
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